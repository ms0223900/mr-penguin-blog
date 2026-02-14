/**
 * Notion Page Content Module
 *
 * A reusable module for querying Notion pages and extracting their content.
 * This module provides three main components:
 *
 * 1. NotionClientService - Handles API communication with Notion
 * 2. PageQueryService - Queries page data and blocks
 * 3. NotionContentExtractor - Extracts plain text from Notion blocks
 *
 * Usage:
 * ```typescript
 * import { NotionClientService, PageQueryService, NotionContentExtractor, SimpleNotionConfig } from './notion-page-content';
 *
 * const config = new SimpleNotionConfig('your-notion-token');
 * const client = new NotionClientService(config);
 * const queryService = new PageQueryService(client);
 * const extractor = new NotionContentExtractor();
 *
 * const pageData = await queryService.getPageData('page-id');
 * const result = extractor.extractContent(pageData);
 * console.log(result.data?.content);
 * ```
 */

// Export all types
export * from './types';

// Export main services
export { NotionClientService, SimpleNotionConfig, EnvNotionConfig } from './notion-client';
export { PageQueryService } from './page-query';
export { NotionContentExtractor } from './content-extractor';

// Re-export commonly used types for convenience
export type {
  NotionPage,
  NotionBlock,
  PageContent,
  PageContentResult,
  INotionClientService,
  IPageQueryService,
  IContentExtractor,
  INotionConfig,
  ILogger
} from './types';