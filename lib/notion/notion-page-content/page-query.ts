import { PageContent, IPageQueryService, INotionClientService, ILogger } from './types';

/**
 * Service for querying page data from Notion
 * Responsible for retrieving page information and blocks, separate from content extraction logic
 */
export class PageQueryService implements IPageQueryService {
  private notionClient: INotionClientService;
  private logger?: ILogger;

  constructor(notionClient: INotionClientService, logger?: ILogger) {
    this.notionClient = notionClient;
    this.logger = logger;
  }

  /**
   * Get page data (page info + blocks) for a single page
   */
  async getPageData(pageId: string): Promise<PageContent> {
    if (this.logger) {
      this.logger.info(`🔍 Querying page data for: ${pageId}`);
    }

    try {
      // Get page basic info and blocks in parallel
      const [pageInfo, blocks] = await Promise.all([
        this.notionClient.getPage(pageId),
        this.notionClient.getAllBlocks(pageId)
      ]);

      const pageContent: PageContent = {
        content: '', // Content will be extracted by NotionContentExtractor
        page: pageInfo,
        blocks
      };

      if (this.logger) {
        this.logger.success(`✅ Successfully queried page data for: ${pageId}`);
      }

      return pageContent;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`❌ Failed to query page data for ${pageId}: ${(error as Error).message}`);
      }
      throw error;
    }
  }

  /**
   * Get page data for multiple pages
   */
  async getPagesData(pageIds: string[]): Promise<PageContent[]> {
    if (this.logger) {
      this.logger.info(`🚀 Starting parallel query of ${pageIds.length} pages...`);
    }

    try {
      const promises = pageIds.map(pageId => this.getPageData(pageId));
      const results = await Promise.allSettled(promises);

      const processedResults: PageContent[] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const errorMessage = `Failed to query page ${pageIds[index]}: ${result.reason?.message || 'Unknown error'}`;

          if (this.logger) {
            this.logger.error(`❌ Page ${pageIds[index]} query failed: ${result.reason}`);
          }

          throw new Error(errorMessage);
        }
      });

      if (this.logger) {
        this.logger.success(`📊 Query completed: ${processedResults.length}/${pageIds.length} pages successful`);
      }

      return processedResults;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`❌ Batch page query failed: ${(error as Error).message}`);
      }
      throw error;
    }
  }
}