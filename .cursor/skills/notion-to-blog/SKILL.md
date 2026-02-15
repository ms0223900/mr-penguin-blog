---
name: notion-to-blog
description: Convert Notion pages to blog articles by fetching content, downloading images, and generating structured JSON articles with AI-powered content analysis.
---

# Notion to Blog Converter

This skill automates the process of converting Notion pages into structured blog articles. It fetches page content from Notion, downloads embedded images, processes the content, and generates SEO-optimized article JSON files ready for publication.

## When to use this skill

Use this skill when you need to:
- Convert Notion pages to structured blog articles
- Automatically download and process embedded images from Notion
- Generate SEO-friendly article metadata using AI
- Create article JSON files that match your blog's schema
- Find related articles based on tags and content

## How to use

### Prerequisites

- Notion API token configured in environment variables (`NOTION_TOKEN`)
- Access to the Notion page you want to convert
- AI assistant access for content analysis (optional but recommended)

### Basic Usage

```typescript
import { NotionToBlogService } from './scripts/notion-to-blog-service';

const service = new NotionToBlogService({
  notionToken: process.env.NOTION_TOKEN,
  outputDir: 'content/articles'
});

await service.convertNotionPageToArticle('your-notion-page-id');
```

### Command Line Usage

```bash
# Convert a specific Notion page
npx ts-node scripts/notion-to-blog-service.ts --pageId "your-page-id"

# Convert with custom options
npx ts-node scripts/notion-to-blog-service.ts --pageId "your-page-id" --outputDir "custom/articles" --aiAnalysis true
```

## What it does

### 1. Content Extraction
- Uses Notion API to fetch page metadata and content blocks
- Extracts plain text content from all Notion block types
- Processes rich text formatting (headings, lists, code blocks, etc.)

### 2. Image Processing
- Scans content for image URLs embedded in Notion pages
- Downloads images to `public/assets/` directory
- Generates unique filenames with hash to prevent conflicts
- Updates content to reference local image paths
- Creates filename mapping for reference

### 3. Article Generation
- Generates structured JSON articles with the following fields:
  - `id`: Auto-incremented article ID
  - `articleId`: SEO-friendly URL slug
  - `title`: Article title (from Notion or AI-generated)
  - `subTitle`: Article subtitle (AI-generated)
  - `description`: SEO description (AI-generated)
  - `publishedAt`: Current timestamp
  - `thumbnailUrl`: URL of first image in content
  - `tags`: Relevant tags (AI-selected from existing articles)
  - `relatedArticleIds`: IDs of 3 most recent articles with same tags
  - `content`: Processed Notion content

### 4. AI-Powered Enhancement
When AI analysis is enabled:
- Generates compelling titles if not present in Notion
- Creates engaging subtitles
- Writes SEO-optimized descriptions
- Intelligently selects relevant tags from your existing article database
- Identifies related articles based on content similarity

## File Structure

```
.cursor/skills/notion-to-blog/
├── SKILL.md                 # This skill documentation
├── scripts/
│   ├── notion-to-blog-service.ts    # Main conversion service
│   ├── image-processor.ts          # Image download and processing
│   ├── article-generator.ts        # Article JSON generation
│   └── ai-content-analyzer.ts      # AI-powered content analysis
└── references/
    ├── api-reference.md       # Notion API integration details
    └── article-schema.md      # Article JSON schema documentation
```

## Dependencies

This skill requires:
- `@notionhq/client`: For Notion API integration
- `fs-extra`: For file system operations
- `crypto`: For filename hashing (built-in Node.js)
- `https/http`: For image downloads (built-in Node.js)

## Configuration Options

```typescript
interface NotionToBlogConfig {
  notionToken: string;           // Notion API token
  outputDir?: string;            // Article output directory (default: 'content/articles')
  assetsDir?: string;            // Image assets directory (default: 'public/assets')
  enableAiAnalysis?: boolean;    // Enable AI content analysis (default: true)
  maxRelatedArticles?: number;   // Max related articles to include (default: 3)
}
```

## Error Handling

The skill includes comprehensive error handling for:
- Invalid Notion page IDs
- Network failures during content fetching
- Image download failures
- File system permission issues
- AI analysis timeouts

## Integration with Existing Codebase

This skill is designed to integrate seamlessly with your existing blog infrastructure:
- Uses your existing `Article` type definitions
- Leverages your `ArticleQueryService` for related article lookup
- Follows your project's file naming conventions
- Maintains compatibility with your content directory structure

## Examples

### Simple Conversion
```typescript
const service = new NotionToBlogService({
  notionToken: process.env.NOTION_TOKEN
});

const result = await service.convertNotionPageToArticle('12345678-abcd-1234-5678-123456789abc');
console.log(`Article created: ${result.articleId}.json`);
```

### Advanced Usage with Custom Processing
```typescript
const service = new NotionToBlogService({
  notionToken: process.env.NOTION_TOKEN,
  enableAiAnalysis: true,
  maxRelatedArticles: 5
});

// Process with custom pre/post processing
await service.convertNotionPageToArticle('page-id', {
  onBeforeProcess: (pageData) => console.log('Processing:', pageData.page?.properties?.title),
  onAfterProcess: (article) => console.log('Generated article:', article.title)
});
```

## See Also

- [Notion API Documentation](references/api-reference.md)
- [Article Schema](references/article-schema.md)
- [Image Processing Details](references/image-processing.md)