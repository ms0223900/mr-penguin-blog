#!/usr/bin/env node

/**
 * Notion 圖片下載自動化腳本
 * 
 * 使用方法：
 * 1. 通過 MCP 工具獲取 Notion 頁面內容，然後將內容保存到文件或直接傳遞
 * 2. 或者提供 Notion 頁面 URL（需要手動使用 MCP 工具獲取內容）
 * 
 * 範例：
 * node scripts/download-notion-images.mjs --url "https://www.notion.so/penguin-cho/GTD-2025-12-2bed5e29c68d8040b86be3dc1d6bd2e6"
 * node scripts/download-notion-images.mjs --content "markdown內容"
 * node scripts/download-notion-images.mjs --file "path/to/content.md"
 */

import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath, URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'assets');

/**
 * 從 Markdown 內容中提取所有圖片 URL
 * @param {string} content - Notion Markdown 內容
 * @returns {Array<{url: string, filename: string}>} 圖片資訊陣列
 */
function extractImageUrls(content) {
  const imageRegex = /<image\s+source=["']([^"']+)["'][^>]*>/gi;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const imageUrl = match[1];
    // 從 URL 中提取檔名，或生成一個檔名
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname;
    let filename = path.basename(pathname);

    // 如果沒有檔名或檔名不包含副檔名，嘗試從 URL 參數中獲取
    if (!filename || !filename.includes('.')) {
      // 嘗試從 URL 中提取檔名
      const filenameMatch = imageUrl.match(/([^\/\?]+\.(png|jpg|jpeg|gif|webp|svg))/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      } else {
        // 生成一個基於時間戳的檔名
        const extension = imageUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)/i)?.[1] || 'png';
        filename = `notion-image-${Date.now()}-${images.length + 1}.${extension}`;
      }
    }

    // 清理檔名，移除查詢參數等
    filename = filename.split('?')[0];

    images.push({
      url: imageUrl,
      filename: filename,
    });
  }

  return images;
}

/**
 * 下載圖片
 * @param {string} imageUrl - 圖片 URL
 * @param {string} outputPath - 輸出路徑
 * @returns {Promise<{success: boolean, size?: number, error?: string}>}
 */
function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve) => {
    const urlObj = new URL(imageUrl);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(outputPath);

    const request = protocol.get(imageUrl, (response) => {
      // 處理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(outputPath);
        return downloadImage(response.headers.location, outputPath).then(resolve);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        resolve({
          success: false,
          error: `HTTP ${response.statusCode}: ${response.statusMessage}`,
        });
        return;
      }

      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        resolve({
          success: true,
          size: stats.size,
        });
      });

      file.on('error', (err) => {
        file.close();
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        resolve({
          success: false,
          error: err.message,
        });
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      resolve({
        success: false,
        error: err.message,
      });
    });

    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      resolve({
        success: false,
        error: 'Request timeout',
      });
    });
  });
}

/**
 * 驗證下載的圖片
 * @param {string} filePath - 文件路徑
 * @returns {Promise<{valid: boolean, size: number, error?: string}>}
 */
async function verifyDownload(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        size: 0,
        error: 'File does not exist',
      };
    }

    const stats = fs.statSync(filePath);

    if (stats.size === 0) {
      return {
        valid: false,
        size: 0,
        error: 'File is empty',
      };
    }

    // 檢查是否為有效的圖片文件（簡單檢查文件頭）
    const buffer = fs.readFileSync(filePath, { start: 0, end: 12 });
    const isValidImage =
      buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF || // JPEG
      buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 || // PNG
      buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 || // GIF
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50; // WEBP

    if (!isValidImage) {
      return {
        valid: false,
        size: stats.size,
        error: 'File is not a valid image',
      };
    }

    return {
      valid: true,
      size: stats.size,
    };
  } catch (error) {
    return {
      valid: false,
      size: 0,
      error: error.message,
    };
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字節數
 * @returns {string} 格式化後的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 主函數
 */
async function main() {
  const args = process.argv.slice(2);
  let content = '';
  let outputDir = DEFAULT_OUTPUT_DIR;

  // 解析命令行參數
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Notion 圖片下載自動化腳本

使用方法：
  node scripts/download-notion-images.mjs --url <Notion頁面URL>
  node scripts/download-notion-images.mjs --content <Markdown內容>
  node scripts/download-notion-images.mjs --file <Markdown文件路徑>

參數說明：
  --url, -u      Notion 頁面 URL（需要先使用 MCP 工具獲取內容）
  --content, -c  Notion Markdown 內容（直接提供）
  --file, -f     Markdown 文件路徑
  --output, -o   輸出目錄（預設: public/assets）
  --help, -h     顯示幫助訊息

注意：
  1. 使用 --url 時，需要先通過 MCP 工具獲取頁面內容
  2. 建議使用 --content 或 --file 直接提供內容
  3. 腳本會自動驗證下載的圖片是否有效

範例：
  # 從文件讀取內容
  node scripts/download-notion-images.mjs --file notion-content.md
  
  # 直接提供內容（需要先通過 MCP 工具獲取）
  node scripts/download-notion-images.mjs --content "$(mcp_Notion_notion-fetch --id 'page-id')"
    `);
    process.exit(0);
  }

  const urlIndex = args.findIndex(arg => arg === '--url' || arg === '-u');
  const contentIndex = args.findIndex(arg => arg === '--content' || arg === '-c');
  const fileIndex = args.findIndex(arg => arg === '--file' || arg === '-f');
  const outputIndex = args.findIndex(arg => arg === '--output' || arg === '-o');

  // 獲取輸出目錄
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    const customOutput = args[outputIndex + 1];
    if (path.isAbsolute(customOutput)) {
      outputDir = customOutput;
    } else {
      outputDir = path.join(PROJECT_ROOT, customOutput);
    }
  }

  // 確保輸出目錄存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 獲取內容
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    const filePath = args[fileIndex + 1];
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(PROJECT_ROOT, filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ 錯誤: 文件不存在: ${absolutePath}`);
      process.exit(1);
    }

    content = fs.readFileSync(absolutePath, 'utf-8');
    console.log(`📄 從文件讀取內容: ${absolutePath}`);
  } else if (contentIndex !== -1 && args[contentIndex + 1]) {
    content = args[contentIndex + 1];
    console.log(`📝 使用提供的內容`);
  } else if (urlIndex !== -1 && args[urlIndex + 1]) {
    const notionUrl = args[urlIndex + 1];
    console.log(`🔗 Notion URL: ${notionUrl}`);
    console.log(`⚠️  注意: 請先使用 MCP 工具獲取頁面內容，然後使用 --content 或 --file 參數`);
    console.log(`   例如: mcp_Notion_notion-fetch --id "${notionUrl}" > content.md`);
    console.log(`   然後: node scripts/download-notion-images.mjs --file content.md`);
    process.exit(1);
  } else {
    console.error(`❌ 錯誤: 請提供 --url, --content 或 --file 參數`);
    console.error(`   使用 --help 查看使用說明`);
    process.exit(1);
  }

  if (!content) {
    console.error(`❌ 錯誤: 無法獲取內容`);
    process.exit(1);
  }

  // 提取圖片 URL
  console.log(`\n🔍 正在提取圖片 URL...`);
  const images = extractImageUrls(content);

  if (images.length === 0) {
    console.log(`ℹ️  未找到任何圖片`);
    process.exit(0);
  }

  console.log(`✅ 找到 ${images.length} 張圖片\n`);

  // 下載圖片
  const results = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const outputPath = path.join(outputDir, image.filename);

    console.log(`[${i + 1}/${images.length}] 📥 下載: ${image.filename}`);
    console.log(`    URL: ${image.url.substring(0, 80)}...`);

    // 檢查文件是否已存在
    if (fs.existsSync(outputPath)) {
      console.log(`    ⚠️  文件已存在，跳過下載`);
      const stats = fs.statSync(outputPath);
      results.push({
        filename: image.filename,
        success: true,
        size: stats.size,
        skipped: true,
      });
      continue;
    }

    // 下載圖片
    const downloadResult = await downloadImage(image.url, outputPath);

    if (downloadResult.success) {
      console.log(`    ✅ 下載成功 (${formatFileSize(downloadResult.size)})`);

      // 驗證下載
      console.log(`    🔍 驗證下載...`);
      const verification = await verifyDownload(outputPath);

      if (verification.valid) {
        console.log(`    ✅ 驗證通過 (${formatFileSize(verification.size)})`);
        results.push({
          filename: image.filename,
          success: true,
          size: verification.size,
          verified: true,
        });
      } else {
        console.log(`    ❌ 驗證失敗: ${verification.error}`);
        results.push({
          filename: image.filename,
          success: false,
          size: verification.size,
          verified: false,
          error: verification.error,
        });
      }
    } else {
      console.log(`    ❌ 下載失敗: ${downloadResult.error}`);
      results.push({
        filename: image.filename,
        success: false,
        error: downloadResult.error,
      });
    }

    console.log('');
  }

  // 輸出總結
  console.log('\n' + '='.repeat(60));
  console.log('📊 下載總結');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success && r.verified !== false).length;
  const failed = results.filter(r => !r.success || r.verified === false).length;
  const skipped = results.filter(r => r.skipped).length;
  const totalSize = results
    .filter(r => r.success && r.size)
    .reduce((sum, r) => sum + (r.size || 0), 0);

  console.log(`✅ 成功: ${successful} 張`);
  console.log(`❌ 失敗: ${failed} 張`);
  if (skipped > 0) {
    console.log(`⏭️  跳過: ${skipped} 張（已存在）`);
  }
  console.log(`📦 總大小: ${formatFileSize(totalSize)}`);
  console.log(`📁 輸出目錄: ${outputDir}`);

  if (failed > 0) {
    console.log('\n❌ 失敗的圖片:');
    results
      .filter(r => !r.success || r.verified === false)
      .forEach(r => {
        console.log(`   - ${r.filename}: ${r.error || '驗證失敗'}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  // 如果有失敗的，返回非零退出碼
  if (failed > 0) {
    process.exit(1);
  }
}

// 執行主函數
main().catch((error) => {
  console.error('❌ 發生錯誤:', error);
  process.exit(1);
});
