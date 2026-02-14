/**
 * Usage Example for Notion Page Content Module
 *
 * This file demonstrates how to use the Notion Page Content module
 * to query pages and extract their content.
 */

import {
  NotionClientService,
  PageQueryService,
  NotionContentExtractor,
  SimpleNotionConfig,
  EnvNotionConfig,
  PageContentResult
} from './index';

// Example 1: Basic usage with simple config
async function basicExample() {
  console.log('=== Basic Usage Example ===');

  // Setup configuration with your Notion token
  const config = new SimpleNotionConfig('your-notion-integration-token-here');

  // Create services
  const client = new NotionClientService(config);
  const queryService = new PageQueryService(client);
  const extractor = new NotionContentExtractor();

  try {
    // Test connection
    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Notion API');
    }

    // Query a single page
    const pageId = 'your-page-id-here';
    const pageData = await queryService.getPageData(pageId);

    // Extract content
    const result: PageContentResult = extractor.extractContent(pageData);

    if (result.success && result.data) {
      console.log('Page Title:', result.data.page?.properties?.Name?.title?.[0]?.plain_text || 'Untitled');
      console.log('Content Length:', result.data.content.length);
      console.log('Content Preview:', result.data.content.substring(0, 200) + '...');
    } else {
      console.error('Failed to extract content:', result.error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Environment-based configuration
async function envConfigExample() {
  console.log('=== Environment Config Example ===');

  // Use environment variable for token
  const config = new EnvNotionConfig('NOTION_TOKEN'); // Looks for process.env.NOTION_TOKEN

  const client = new NotionClientService(config);
  const queryService = new PageQueryService(client);
  const extractor = new NotionContentExtractor();

  try {
    // Query multiple pages
    const pageIds = [
      'page-id-1',
      'page-id-2',
      'page-id-3'
    ];

    const pagesData = await queryService.getPagesData(pageIds);

    // Extract content from each page
    for (let i = 0; i < pagesData.length; i++) {
      const result = extractor.extractContent(pagesData[i]);

      if (result.success && result.data) {
        console.log(`\n--- Page ${i + 1} ---`);
        console.log('Content Length:', result.data.content.length);
        console.log('Has Blocks:', result.data.blocks?.length || 0);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: With custom logger
async function customLoggerExample() {
  console.log('=== Custom Logger Example ===');

  // Custom logger implementation
  const customLogger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    warn: (msg: string) => console.warn(`[WARN] ${msg}`),
    error: (msg: string) => console.error(`[ERROR] ${msg}`),
    success: (msg: string) => console.log(`[SUCCESS] ${msg}`)
  };

  const config = new SimpleNotionConfig('your-token');
  const client = new NotionClientService(config, customLogger);
  const queryService = new PageQueryService(client, customLogger);
  const extractor = new NotionContentExtractor(customLogger);

  try {
    const pageData = await queryService.getPageData('page-id');
    const result = extractor.extractContent(pageData);

    console.log('Extraction completed with custom logging');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Advanced usage - process multiple pages with error handling
async function advancedExample() {
  console.log('=== Advanced Usage Example ===');

  const config = new SimpleNotionConfig('your-token');
  const client = new NotionClientService(config);
  const queryService = new PageQueryService(client);
  const extractor = new NotionContentExtractor();

  const pageIds = [
    'valid-page-id-1',
    'invalid-page-id',
    'valid-page-id-2'
  ];

  // Process pages individually with individual error handling
  const results: Array<{ pageId: string; result: PageContentResult | null; error?: string }> = [];

  for (const pageId of pageIds) {
    try {
      console.log(`Processing page: ${pageId}`);
      const pageData = await queryService.getPageData(pageId);
      const result = extractor.extractContent(pageData);

      results.push({ pageId, result });
    } catch (error) {
      console.warn(`Failed to process page ${pageId}:`, error);
      results.push({
        pageId,
        result: null,
        error: (error as Error).message
      });
    }
  }

  // Summarize results
  const successful = results.filter(r => r.result?.success);
  const failed = results.filter(r => !r.result?.success || r.error);

  console.log(`\nSummary: ${successful.length} successful, ${failed.length} failed`);

  // Show successful extractions
  successful.forEach(({ pageId, result }) => {
    if (result?.data) {
      console.log(`✅ ${pageId}: ${result.data.content.length} characters`);
    }
  });
}

// Export examples for testing
export {
  basicExample,
  envConfigExample,
  customLoggerExample,
  advancedExample
};

// Run basic example if this file is executed directly
if (require.main === module) {
  basicExample().catch(console.error);
}