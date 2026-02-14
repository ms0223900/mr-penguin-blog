import { Client, QueryDataSourceParameters, QueryDataSourceResponse, } from '@notionhq/client';
import {
  ILogger,
  INotionClientService,
  INotionConfig,
  NotionBlock,
  NotionPage
} from './types';

/**
 * Notion API client service with connection management
 * Generic implementation that can be reused across projects
 */
export class NotionClientService implements INotionClientService {
  private notion: Client | null = null;
  private config: INotionConfig;
  private logger?: ILogger;

  constructor(config: INotionConfig, logger?: ILogger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Get or create Notion client instance
   */
  private getNotionClient(): Client {
    if (!this.notion) {
      const token = this.config.getToken();

      if (!token) {
        throw new Error('NOTION_TOKEN is not configured');
      }

      this.notion = new Client({
        auth: token
      });
    }

    return this.notion;
  }

  /**
   * Test connection to Notion API
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = this.getNotionClient();

      // Test connection by trying to get user info
      await client.users.me({});

      if (this.logger) {
        this.logger.success('✅ Notion API connection successful');
      }

      return true;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`❌ Notion API connection failed: ${(error as Error).message}`);
      }

      return false;
    }
  }

  /**
   * Query database with given parameters
   */
  async queryDataSources(params: QueryDataSourceParameters): Promise<QueryDataSourceResponse> {
    const client = this.getNotionClient();
    return await client.dataSources.query(params);
  }

  /**
   * Retrieve a specific page
   */
  async getPage(pageId: string): Promise<NotionPage> {
    const client = this.getNotionClient();
    const response = await client.pages.retrieve({ page_id: pageId });

    return response as NotionPage;
  }

  /**
   * Get page blocks (content)
   */
  async getPageBlocks(blockId: string, params: any = {}): Promise<any> {
    const client = this.getNotionClient();

    const defaultParams = {
      block_id: blockId,
      page_size: 100,
      ...params
    };

    return await client.blocks.children.list(defaultParams);
  }

  /**
   * Get all blocks recursively
   */
  async getAllBlocks(blockId: string): Promise<NotionBlock[]> {
    const allBlocks: NotionBlock[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await this.getPageBlocks(blockId, {
        start_cursor: cursor
      });

      allBlocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    // Recursively get children blocks
    for (const block of allBlocks) {
      if (block.has_children) {
        block.children = await this.getAllBlocks(block.id);
      }
    }

    return allBlocks;
  }

  /**
   * Update client configuration
   */
  updateConfig(newConfig: INotionConfig): void {
    this.config = newConfig;
    // Reset client to force re-initialization with new config
    this.notion = null;
  }
}

/**
 * Simple config implementation for basic usage
 */
export class SimpleNotionConfig implements INotionConfig {
  constructor(private token: string) { }

  getToken(): string {
    return this.token;
  }
}

/**
 * Environment-based config implementation
 */
export class EnvNotionConfig implements INotionConfig {
  constructor(private envVarName: string = 'NOTION_TOKEN') { }

  getToken(): string {
    const token = process.env[this.envVarName];
    if (!token) {
      throw new Error(`${this.envVarName} environment variable is not set`);
    }
    return token;
  }
}