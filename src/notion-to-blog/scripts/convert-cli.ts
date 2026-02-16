#!/usr/bin/env ts-node

/**
 * CLI Tool for Converting Notion Pages to Blog Articles
 *
 * Usage: ts-node convert-cli.ts <page-id>
 */

// Register tsconfig paths for module resolution
import 'tsconfig-paths/register';

import { parseNotionUrlToId } from '@/src/notion-to-blog/scripts/parse-notion-url-to-id';
import { ConversionResult, NotionToBlogService } from './notion-to-blog-service';

function printUsage() {
  console.log('Usage: ts-node convert-cli.ts <page-id>');
  console.log('');
  console.log('Arguments:');
  console.log('  page-id    The Notion page ID to convert (required)');
  console.log('');
  console.log('Environment Variables:');
  console.log('  NOTION_TOKEN    Notion API integration token (required)');
  console.log('');
  console.log('Examples:');
  console.log('  ts-node convert-cli.ts 12345678-abcd-1234-5678-123456789abc');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
}

function parseArgs(): { pageId: string } {
  const args = process.argv.slice(2);

  const result = validateArgs(args);

  switch (result.type) {
    case ValidationResultType.OK: {
      const pageId = parsePageIdFromArg(result.pageId);
      validateUuid(pageId);
      return { pageId };
    }
    case ValidationResultType.HELP:
      printUsage();
      process.exit(0);
    case ValidationResultType.ERROR:
      console.error('❌ Error:', result.message);
      process.exit(1);
  }
}

enum ValidationResultType {
  OK = 'ok',
  HELP = 'help',
  ERROR = 'error',
}

type ValidationResult =
  | { type: ValidationResultType.OK; pageId: string }
  | { type: ValidationResultType.HELP }
  | { type: ValidationResultType.ERROR; message: string };

function validateArgs(args: string[]): ValidationResult {
  if (args.includes('--help') || args.includes('-h')) {
    return { type: ValidationResultType.HELP };
  }

  if (args.length === 0) {
    return { type: ValidationResultType.ERROR, message: 'Page ID is required' };
  }

  if (args.length !== 1) {
    return { type: ValidationResultType.ERROR, message: 'Exactly one page ID is required' };
  }

  return { type: ValidationResultType.OK, pageId: args[0] };
}


// parse page id from arg
function parsePageIdFromArg(arg: string): string {
  function isNotionUrl(arg: string): boolean {
    try {
      const url = new URL(arg);
      return url.hostname.includes('notion.so');
    } catch {
      return false;
    }
  }

  if (isNotionUrl(arg)) {
    return parseNotionUrlToId(arg);
  }
  return arg
}

function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function validateUuid(uuid: string): void {
  if (!isValidUuid(uuid)) {
    const errorMessage = 'Invalid page ID format. Expected UUID format (e.g., 12345678-abcd-1234-5678-123456789abc)';
    throw new Error(errorMessage);
  }
}

async function main() {
  const { pageId } = parseArgs();

  console.log('🚀 Notion to Blog Converter CLI\n');

  // Initialize the service with configuration optimized for CLI usage
  const service = new NotionToBlogService({
    enableAiAnalysis: true, // Enable AI-powered content enhancement
    maxRelatedArticles: 0, // Disable related articles to avoid repository dependencies
  });

  console.log(`📄 Converting Notion page: ${pageId}`);
  console.log('This may take a few moments depending on content size...\n');

  try {
    // Test connection first
    console.log('🔍 Testing Notion API connection...');
    const connected = await service.testConnection();

    if (!connected) {
      showConnectedFailedMessage();
      process.exit(1);
    }

    console.log('✅ Notion API connection successful\n');

    // Convert the page
    const result = await service.convertNotionPageToArticle(pageId, {
      onBeforeProcess: (pageData) => {
        const title = pageData.page?.properties?.title?.title?.[0]?.plain_text || 'Untitled';
        console.log(`📝 Processing page: "${title}"`);
      },

      onImageDownload: (url, localPath) => {
        console.log(`⬇️  Downloaded: ${url.split('/').pop()} → ${localPath.split('/').pop()}`);
      },
    });

    if (result.success) {
      showSuccessfulMessage(result);
      process.exit(0);
    } else {
      console.error('\n❌ Conversion failed:');
      console.error(result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  }

  function showConnectedFailedMessage() {
    console.error('❌ Cannot connect to Notion API.');
    console.error('Please ensure NOTION_TOKEN environment variable is set correctly.');
    console.error('Create an integration at: https://developers.notion.com/');
  }

  function showSuccessfulMessage(result: ConversionResult) {
    console.log('\n🎉 Conversion completed successfully!');
    console.log('='.repeat(50));
    console.log(`Article ID: ${result.articleId}`);
    console.log(`Saved to: ${result.articlePath}`);

    if (result.metadata) {
      console.log(`Images processed: ${result.metadata.imagesDownloaded}`);
      console.log(`Content length: ${result.metadata.contentLength} characters`);
    }

    console.log('='.repeat(50));
    console.log('\nNext steps:');
    console.log('1. Review the generated article JSON');
    console.log('2. Check downloaded images in public/assets/');
    console.log('3. Commit and push changes to your repository');
    console.log('4. The article is now ready for publication!');
  }
}

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 CLI execution failed:', error);
    process.exit(1);
  });
}