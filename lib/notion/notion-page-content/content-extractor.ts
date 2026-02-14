import {
  NotionBlock,
  NotionBlockType,
  PageContent,
  PageContentResult,
  IContentExtractor,
  RichTextContent,
  ILogger
} from './types';

/**
 * Pure processor for extracting content from Notion page data.
 * No I/O - only transforms PageContent (blocks) to plain text.
 */
export class NotionContentExtractor implements IContentExtractor {
  private logger?: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger;
  }

  /**
   * Extract content from page data (pure - no I/O)
   */
  extractContent(pageData: PageContent): PageContentResult {
    try {
      if (this.logger) {
        this.logger.info(`📄 Extracting content from page data`);
      }

      // Extract plain text content from blocks (handle empty blocks)
      const content = pageData.blocks ? this.extractPlainTextFromBlocks(pageData.blocks) : '';

      const enrichedPageContent: PageContent = {
        ...pageData,
        content
      };

      if (this.logger) {
        this.logger.success(`✅ Successfully extracted content from page data`);
      }

      return {
        success: true,
        data: enrichedPageContent
      };
    } catch (error) {
      if (this.logger) {
        this.logger.error(`❌ Failed to extract content from page data: ${(error as Error).message}`);
      }

      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Extract plain text from Notion blocks
   */
  private extractPlainTextFromBlocks(blocks: NotionBlock[], separator: string = '\n'): string {
    const contentParts: string[] = [];

    for (const block of blocks) {
      const blockText = this.extractBlockText(block);

      if (blockText.trim()) {
        contentParts.push(blockText);
      }

      // Recursively extract child blocks
      if (block.children && block.children.length > 0) {
        const childContent = this.extractPlainTextFromBlocks(block.children, separator);
        if (childContent.trim()) {
          contentParts.push(childContent);
        }
      }
    }

    return contentParts.join(separator);
  }

  /**
   * Extract text content from a single block
   */
  private extractBlockText(block: NotionBlock): string {
    const blockType = block.type as NotionBlockType;

    switch (blockType) {
      case NotionBlockType.PARAGRAPH:
        return this.extractRichTextContent(block.paragraph?.rich_text || []);

      case NotionBlockType.HEADING_1:
        return '# ' + this.extractRichTextContent(block.heading_1?.rich_text || []);

      case NotionBlockType.HEADING_2:
        return '## ' + this.extractRichTextContent(block.heading_2?.rich_text || []);

      case NotionBlockType.HEADING_3:
        return '### ' + this.extractRichTextContent(block.heading_3?.rich_text || []);

      case NotionBlockType.BULLETED_LIST_ITEM:
        return '• ' + this.extractRichTextContent(block.bulleted_list_item?.rich_text || []);

      case NotionBlockType.NUMBERED_LIST_ITEM:
        return '1. ' + this.extractRichTextContent(block.numbered_list_item?.rich_text || []);

      case NotionBlockType.TO_DO:
        const checked = block.to_do?.checked ? '[x]' : '[ ]';
        return `${checked} ` + this.extractRichTextContent(block.to_do?.rich_text || []);

      case NotionBlockType.CODE:
        return '```\n' + this.extractRichTextContent(block.code?.rich_text || []) + '\n```';

      case NotionBlockType.QUOTE:
        return '> ' + this.extractRichTextContent(block.quote?.text || []);

      case NotionBlockType.CALLOUT:
        return '📝 ' + this.extractRichTextContent(block.callout?.rich_text || []);

      case NotionBlockType.DIVIDER:
        return '---';

      default:
        // Try to extract text from unknown block types
        const blockData = (block as any)[blockType];
        if (blockData && blockData.text) {
          return this.extractRichTextContent(blockData.text);
        }
        return '';
    }
  }

  /**
   * Extract plain text from rich text array
   */
  private extractRichTextContent(richTextArray: RichTextContent[]): string {
    if (!Array.isArray(richTextArray)) {
      return '';
    }

    return richTextArray
      .map((textObj) => textObj.plain_text || textObj.text?.content || '')
      .join('');
  }
}