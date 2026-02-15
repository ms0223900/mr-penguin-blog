/**
 * Image Processor for Notion to Blog Converter
 *
 * Handles downloading and processing images from Notion content.
 * Extracts image URLs, downloads them, and updates content references.
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import path from 'path';
import { URL } from 'url';

export interface ImageProcessingResult {
  processedContent: string;
  processed: number;
  skipped: number;
  failed: number;
  mapping: ImageMapping[];
}

export interface ImageMapping {
  originalUrl: string;
  localPath: string;
  newFilename: string;
  success: boolean;
  error?: string;
}

export class ImageProcessor {
  private assetsDir: string;

  constructor(assetsDir: string = 'public/assets') {
    this.assetsDir = assetsDir;
  }

  /**
   * Process all images in content: download and update references
   */
  async processImagesInContent(
    content: string,
    onImageDownload?: (imageUrl: string, localPath: string) => void
  ): Promise<ImageProcessingResult> {
    // Extract image URLs from content
    const imageUrls = this.extractImageUrls(content);

    if (imageUrls.length === 0) {
      return {
        processedContent: content,
        processed: 0,
        skipped: 0,
        failed: 0,
        mapping: [],
      };
    }

    console.log(`🖼️  Found ${imageUrls.length} images to process`);

    // Ensure assets directory exists
    await fs.ensureDir(this.assetsDir);

    // Process each image
    const mapping: ImageMapping[] = [];
    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (const imageUrl of imageUrls) {
      try {
        const result = await this.downloadImage(imageUrl);

        if (result.success) {
          mapping.push(result);

          if (onImageDownload && result.success) {
            onImageDownload(imageUrl, result.localPath);
          }
        } else {
          failed++;
          mapping.push(result);
          console.warn(`⚠️  Failed to process image ${imageUrl}: ${result.error}`);
        }
      } catch (error) {
        failed++;
        const errorMapping: ImageMapping = {
          originalUrl: imageUrl,
          localPath: '',
          newFilename: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        mapping.push(errorMapping);
        console.warn(`⚠️  Error processing image ${imageUrl}:`, error);
      }
    }

    // Update content with new image paths
    let processedContent = content;
    for (const map of mapping) {
      if (map.success) {
        // Replace the original URL with local path
        const relativePath = path.relative('public', map.localPath);
        processedContent = processedContent.replace(
          new RegExp(this.escapeRegExp(map.originalUrl), 'g'),
          `/${relativePath}`
        );
      }
    }

    return {
      processedContent,
      processed,
      skipped,
      failed,
      mapping,
    };
  }

  /**
   * Extract image URLs from Notion content
   */
  private extractImageUrls(content: string): string[] {
    // Notion images are typically embedded as <image source="url"> or similar patterns
    // This regex looks for common image URL patterns in the content
    const imageRegex = /<image\s+source=["']([^"']+)["'][^>]*>/gi;
    const urls: string[] = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }

    // Also look for direct image URLs in markdown format ![alt](url)
    const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/g;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }

    // Remove duplicates
    return [...new Set(urls)];
  }

  /**
   * Download a single image
   */
  private async downloadImage(imageUrl: string): Promise<ImageMapping> {
    try {
      // Generate filename with hash to avoid conflicts
      const hash = this.generateHash(imageUrl);
      const extension = this.getImageExtension(imageUrl);
      const filename = `${this.getBaseFilename(imageUrl)}-${hash}.${extension}`;
      const localPath = path.join(this.assetsDir, filename);

      // Check if file already exists
      if (await fs.pathExists(localPath)) {
        return {
          originalUrl: imageUrl,
          localPath,
          newFilename: filename,
          success: true,
          // Note: this is a bit of a hack since we don't have a skipped field in ImageMapping
        } as any;
      }

      // Download the image
      const downloadResult = await this.downloadFile(imageUrl, localPath);

      if (downloadResult.success) {
        // Verify the downloaded file is a valid image
        const isValid = await this.verifyImageFile(localPath);
        if (!isValid) {
          await fs.remove(localPath);
          return {
            originalUrl: imageUrl,
            localPath: '',
            newFilename: '',
            success: false,
            error: 'Downloaded file is not a valid image',
          };
        }

        return {
          originalUrl: imageUrl,
          localPath,
          newFilename: filename,
          success: true,
        };
      } else {
        return {
          originalUrl: imageUrl,
          localPath: '',
          newFilename: '',
          success: false,
          error: downloadResult.error,
        };
      }
    } catch (error) {
      return {
        originalUrl: imageUrl,
        localPath: '',
        newFilename: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Download file from URL
   */
  private async downloadFile(url: string, outputPath: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const request = protocol.get(url, (response) => {
          // Handle redirects
          if (response.statusCode === 301 || response.statusCode === 302) {
            return this.downloadFile(response.headers.location!, outputPath).then(resolve);
          }

          if (response.statusCode !== 200) {
            resolve({
              success: false,
              error: `HTTP ${response.statusCode}: ${response.statusMessage}`,
            });
            return;
          }

          const file = fs.createWriteStream(outputPath);
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve({ success: true });
          });

          file.on('error', (err) => {
            file.close();
            fs.remove(outputPath).catch(() => { }); // Ignore cleanup errors
            resolve({
              success: false,
              error: err.message,
            });
          });
        });

        request.on('error', (err) => {
          fs.remove(outputPath).catch(() => { }); // Ignore cleanup errors
          resolve({
            success: false,
            error: err.message,
          });
        });

        request.setTimeout(30000, () => {
          request.destroy();
          fs.remove(outputPath).catch(() => { }); // Ignore cleanup errors
          resolve({
            success: false,
            error: 'Request timeout',
          });
        });
      } catch (error) {
        resolve({
          success: false,
          error: error instanceof Error ? error.message : 'Invalid URL',
        });
      }
    });
  }

  /**
   * Verify if downloaded file is a valid image
   */
  private async verifyImageFile(filePath: string): Promise<boolean> {
    try {
      if (!(await fs.pathExists(filePath))) {
        return false;
      }

      const stats = await fs.stat(filePath);
      if (stats.size === 0) {
        return false;
      }

      // Read first few bytes to check image headers
      const buffer = await fs.readFile(filePath);
      const bufferArray = buffer.toJSON().data;

      // Check for common image signatures
      const isJPEG = bufferArray[0] === 0xFF && bufferArray[1] === 0xD8 && bufferArray[2] === 0xFF;
      const isPNG = bufferArray[0] === 0x89 && bufferArray[1] === 0x50 && bufferArray[2] === 0x4E && bufferArray[3] === 0x47;
      const isGIF = bufferArray[0] === 0x47 && bufferArray[1] === 0x49 && bufferArray[2] === 0x46;
      const isWebP = bufferArray[8] === 0x57 && bufferArray[9] === 0x45 && bufferArray[10] === 0x42 && bufferArray[11] === 0x50;

      return isJPEG || isPNG || isGIF || isWebP;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate hash for filename uniqueness
   */
  private generateHash(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  }

  /**
   * Get image extension from URL
   */
  private getImageExtension(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const extension = path.extname(pathname).toLowerCase().replace('.', '');

      // Validate extension
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      if (validExtensions.includes(extension)) {
        return extension;
      }
    } catch (error) {
      // Ignore URL parsing errors
    }

    // Default to png if extension cannot be determined
    return 'png';
  }

  /**
   * Get base filename from URL
   */
  private getBaseFilename(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const basename = path.basename(pathname, path.extname(pathname));

      // Clean the filename
      return basename.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 50);
    } catch (error) {
      return 'notion-image';
    }
  }

  /**
   * Escape string for regex
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}