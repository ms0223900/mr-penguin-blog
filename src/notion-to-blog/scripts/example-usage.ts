#!/usr/bin/env ts-node

/**
 * Example Usage Script
 *
 * Demonstrates how to use the Notion to Blog Converter skill.
 */

import { NotionToBlogService } from './notion-to-blog-service';

async function main() {
  console.log('🚀 Notion to Blog Converter - Example Usage\n');

  // Initialize the service with default configuration
  const service = new NotionToBlogService({
    enableAiAnalysis: true, // Enable AI-powered content enhancement
    maxRelatedArticles: 3,
  });

  // Example Notion page ID (replace with your actual page ID)
  const examplePageId = '12345678-abcd-1234-5678-123456789abc';

  console.log(`📄 Converting Notion page: ${examplePageId}`);
  console.log('This example uses AI analysis to generate titles, descriptions, and tags.\n');

  try {
    // Test connection first
    console.log('🔍 Testing Notion API connection...');
    const connected = await service.testConnection();

    if (!connected) {
      console.error('❌ Cannot connect to Notion API.');
      console.error('Please ensure NOTION_TOKEN environment variable is set.');
      console.error('Create an integration at: https://developers.notion.com/');
      process.exit(1);
    }

    console.log('✅ Notion API connection successful\n');

    // Convert the page
    const result = await service.convertNotionPageToArticle(examplePageId, {
      onBeforeProcess: (pageData) => {
        const title = pageData.page?.properties?.title?.title?.[0]?.plain_text || 'Untitled';
        console.log(`📝 Processing page: "${title}"`);
      },

      onImageDownload: (url, localPath) => {
        console.log(`⬇️  Downloaded: ${url.split('/').pop()} → ${localPath.split('/').pop()}`);
      },
    });

    if (result.success) {
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

    } else {
      console.error('\n❌ Conversion failed:');
      console.error(result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  }
}

/**
 * Alternative usage examples
 */
async function alternativeExamples() {
  console.log('\n📚 Alternative Usage Examples\n');

  // Example 1: Disable AI analysis
  console.log('1. Without AI Analysis:');
  console.log(`const service = new NotionToBlogService({ enableAiAnalysis: false });`);

  // Example 2: Custom directories
  console.log('\n2. Custom Output Directories:');
  console.log(`const service = new NotionToBlogService({
  outputDir: 'custom/articles',
  assetsDir: 'custom/images'
});`);

  // Example 3: Batch processing
  console.log('\n3. Batch Processing Multiple Pages:');
  console.log(`const pageIds = ['page1', 'page2', 'page3'];
for (const pageId of pageIds) {
  await service.convertNotionPageToArticle(pageId);
}`);

  // Example 4: Custom processing callbacks
  console.log('\n4. Custom Processing Callbacks:');
  console.log(`await service.convertNotionPageToArticle(pageId, {
  onBeforeProcess: (data) => console.log('Starting:', data.page?.id),
  onAfterProcess: (article) => console.log('Generated:', article.title),
  onImageDownload: (url, path) => console.log('Image saved:', path)
});`);

  console.log('\n📖 See the full API documentation in SKILL.md for more options.');
}

// Run the example
if (require.main === module) {
  main().then(() => {
    console.log('\n💡 Tip: Run this script with a real Notion page ID to see it in action!');
    console.log('Replace the examplePageId with your actual Notion page ID.');

    // Show alternative examples
    alternativeExamples();
  }).catch((error) => {
    console.error('💥 Example failed:', error);
    process.exit(1);
  });
}

export { main as runExample };