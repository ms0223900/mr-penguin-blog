#!/usr/bin/env ts-node

/**
 * Notion to Blog Converter Service
 *
 * Main service for converting Notion pages to structured blog articles.
 * Handles the complete workflow: content extraction, image processing, and article generation.
 */

import { NotionContentExtractor } from '@/lib/notion/notion-page-content/content-extractor';
import { EnvNotionConfig, NotionClientService } from '@/lib/notion/notion-page-content/notion-client';
import { PageQueryService } from '@/lib/notion/notion-page-content/page-query';
import { PageContent } from '@/lib/notion/notion-page-content/types';
import { Article } from '@/repository/article/article.types';
import path from 'path';
import { AIContentAnalyzer } from './ai-content-analyzer';
import { ArticleGenerator } from './article-generator';
import { ImageProcessingResult, ImageProcessor } from './image-processor';

export interface NotionToBlogConfig {
  notionToken?: string;
  outputDir?: string;
  assetsDir?: string;
  enableAiAnalysis?: boolean;
  maxRelatedArticles?: number;
}

export interface ConversionResult {
  success: boolean;
  articleId?: string;
  articlePath?: string;
  error?: string;
  metadata?: {
    imagesDownloaded: number;
    imagesProcessed: number;
    contentLength: number;
  };
}

export interface ConversionCallbacks {
  onBeforeProcess?: (pageData: any) => void;
  onAfterProcess?: (article: Article) => void;
  onImageDownload?: (imageUrl: string, localPath: string) => void;
}

export class NotionToBlogService {
  private config: Required<NotionToBlogConfig>;
  private notionClient: NotionClientService;
  private pageQueryService: PageQueryService;
  private contentExtractor: NotionContentExtractor;
  private imageProcessor: ImageProcessor;
  private articleGenerator: ArticleGenerator;
  private aiAnalyzer?: AIContentAnalyzer;

  constructor(config: NotionToBlogConfig = {}) {
    this.config = {
      notionToken: config.notionToken || '',
      outputDir: config.outputDir || 'content/articles',
      assetsDir: config.assetsDir || 'public/assets',
      enableAiAnalysis: config.enableAiAnalysis ?? true,
      maxRelatedArticles: config.maxRelatedArticles ?? 3,
    };

    // Initialize Notion services
    const notionConfig = config.notionToken
      ? new EnvNotionConfig()
      : new EnvNotionConfig('NOTION_TOKEN');

    this.notionClient = new NotionClientService(notionConfig);
    this.pageQueryService = new PageQueryService(this.notionClient);
    this.contentExtractor = new NotionContentExtractor();

    // Initialize our custom services
    this.imageProcessor = new ImageProcessor(this.config.assetsDir);
    this.articleGenerator = new ArticleGenerator(this.config.outputDir);

    if (this.config.enableAiAnalysis) {
      this.aiAnalyzer = new AIContentAnalyzer();
    }
  }

  /**
   * Convert a Notion page to a blog article
   */
  async convertNotionPageToArticle(
    pageId: string,
    callbacks: ConversionCallbacks = {}
  ): Promise<ConversionResult> {
    try {
      const pageData = await this.getPageData(pageId);

      callbacks.onBeforeProcess?.(pageData);

      const extractedContent = this.extractPageData(pageData);

      const imageProcessingResult = await this.processContentImage(extractedContent, callbacks);

      const article = await this.analysizePageContent(pageData, imageProcessingResult);

      callbacks.onAfterProcess?.(article);

      const saveResult = await this.saveArticle(article);

      return {
        success: true,
        articleId: article.articleId,
        articlePath: saveResult.articlePath,
        metadata: {
          imagesDownloaded: imageProcessingResult.processed,
          imagesProcessed: imageProcessingResult.processed + imageProcessingResult.skipped,
          contentLength: extractedContent.length,
        },
      };

    } catch (error) {
      console.error(`❌ Conversion failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async saveArticle(article: Article) {
    console.log(`💾 Saving article...`);
    const saveResult = await this.articleGenerator.saveArticle(article);

    if (!saveResult.success) {
      throw new Error(`Failed to save article: ${saveResult.error}`);
    }

    console.log(`✅ Article saved: ${saveResult.articlePath}`);
    console.log(`🎉 Conversion completed successfully!`);
    return saveResult;
  }

  private async analysizePageContent(pageData: PageContent, imageProcessingResult: ImageProcessingResult) {
    console.log(`📄 Generating article...`);

    let article: Article;
    if (this.aiAnalyzer && this.config.enableAiAnalysis) {
      console.log(`🤖 Performing AI content analysis...`);
      article = await this.articleGenerator.generateArticleWithAIAnalysis(
        pageData,
        imageProcessingResult.processedContent,
        this.aiAnalyzer,
        this.config.maxRelatedArticles
      );
    } else {
      console.log(`📝 Generating article without AI analysis...`);
      article = await this.articleGenerator.generateArticle(
        pageData,
        imageProcessingResult.processedContent,
        this.config.maxRelatedArticles
      );
    }
    return article;
  }

  private async processContentImage(extractedContent: string, callbacks: ConversionCallbacks) {
    console.log(`🖼️  Processing images...`);
    const imageProcessingResult = await this.imageProcessor.processImagesInContent(
      extractedContent,
      (imageUrl, localPath) => {
        if (callbacks.onImageDownload) {
          callbacks.onImageDownload(imageUrl, localPath);
        }
      }
    );

    console.log(`✅ Images processed: ${imageProcessingResult.processed} downloaded, ${imageProcessingResult.skipped} skipped`);
    return imageProcessingResult;
  }

  private extractPageData(pageData: PageContent) {
    console.log(`📝 Extracting content...`);
    const contentResult = this.contentExtractor.extractContent(pageData);

    if (!contentResult.success) {
      throw new Error(`Failed to extract content: ${contentResult.error}`);
    }

    const extractedContent = contentResult.data!.content;
    console.log(`✅ Content extracted (${extractedContent.length} characters)`);
    return extractedContent;
  }

  private async getPageData(pageId: string): Promise<PageContent> {
    console.log(`🚀 Starting conversion for Notion page: ${pageId}`);

    // Step 1: Fetch page data from Notion
    console.log(`📥 Fetching page data from Notion...`);
    const pageData = await this.pageQueryService.getPageData(pageId);
    return pageData;
  }

  /**
   * Test Notion API connection
   */
  async testConnection(): Promise<boolean> {
    return await this.notionClient.testConnection();
  }

  /**
   * Get conversion statistics
   */
  getConversionStats(): {
    outputDir: string;
    assetsDir: string;
    aiAnalysisEnabled: boolean;
    maxRelatedArticles: number;
  } {
    return {
      outputDir: this.config.outputDir,
      assetsDir: this.config.assetsDir,
      aiAnalysisEnabled: this.config.enableAiAnalysis,
      maxRelatedArticles: this.config.maxRelatedArticles,
    };
  }
}

/**
 * Command line interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Notion to Blog Converter

Usage:
  ts-node scripts/notion-to-blog-service.ts --pageId <page-id> [options]

Options:
  --pageId, -p       Notion page ID (required)
  --outputDir, -o    Output directory for articles (default: content/articles)
  --assetsDir, -a    Directory for downloaded images (default: public/assets)
  --no-ai            Disable AI content analysis
  --maxRelated, -r   Maximum related articles (default: 3)
  --help, -h         Show this help

Examples:
  ts-node scripts/notion-to-blog-service.ts --pageId "12345678-abcd-1234-5678-123456789abc"
  ts-node scripts/notion-to-blog-service.ts -p "page-id" --no-ai --outputDir "custom/articles"
    `);
    process.exit(0);
  }

  const pageIdIndex = args.findIndex(arg => arg === '--pageId' || arg === '-p');
  const outputDirIndex = args.findIndex(arg => arg === '--outputDir' || arg === '-o');
  const assetsDirIndex = args.findIndex(arg => arg === '--assetsDir' || arg === '-a');
  const maxRelatedIndex = args.findIndex(arg => arg === '--maxRelated' || arg === '-r');
  const noAi = args.includes('--no-ai');

  if (pageIdIndex === -1 || !args[pageIdIndex + 1]) {
    console.error('❌ Error: --pageId is required');
    process.exit(1);
  }

  const pageId = args[pageIdIndex + 1];
  const outputDir = outputDirIndex !== -1 ? args[outputDirIndex + 1] : 'content/articles';
  const assetsDir = assetsDirIndex !== -1 ? args[assetsDirIndex + 1] : 'public/assets';
  const maxRelated = maxRelatedIndex !== -1 ? parseInt(args[maxRelatedIndex + 1]) : 3;

  const service = new NotionToBlogService({
    outputDir,
    assetsDir,
    enableAiAnalysis: !noAi,
    maxRelatedArticles: maxRelated,
  });

  // Test connection first
  console.log('🔍 Testing Notion API connection...');
  const connected = await service.testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to Notion API. Please check your NOTION_TOKEN.');
    process.exit(1);
  }

  // Perform conversion
  const result = await service.convertNotionPageToArticle(pageId, {
    onBeforeProcess: (pageData) => {
      const title = pageData.page?.properties?.title?.title?.[0]?.plain_text || 'Untitled';
      console.log(`📄 Processing page: "${title}"`);
    },
    onImageDownload: (imageUrl, localPath) => {
      console.log(`⬇️  Downloaded image: ${path.basename(localPath)}`);
    },
  });

  if (result.success) {
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SUCCESS!');
    console.log('='.repeat(60));
    console.log(`Article ID: ${result.articleId}`);
    console.log(`File saved: ${result.articlePath}`);
    if (result.metadata) {
      console.log(`Images processed: ${result.metadata.imagesProcessed}`);
      console.log(`Content length: ${result.metadata.contentLength} characters`);
    }
    console.log('='.repeat(60));
  } else {
    console.error('\n❌ CONVERSION FAILED');
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export default NotionToBlogService;