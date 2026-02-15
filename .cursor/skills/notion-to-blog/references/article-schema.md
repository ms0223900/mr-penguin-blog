# Article JSON Schema Reference

This document describes the structure and requirements of the generated article JSON files.

## Overview

Articles are stored as JSON files in the `content/articles/` directory, following the existing `Article` type definition from `repository/article/article.types.ts`.

## Schema Structure

```typescript
type Article = {
  id: number;                    // Auto-incremented unique identifier
  articleId: string;            // SEO-friendly URL slug
  title: string;                // Article title
  subTitle: string | null;      // Article subtitle (AI-generated)
  description: string | null;   // SEO description (AI-generated)
  publishedAt: string;          // ISO 8601 timestamp
  thumbnailUrl: string | null;  // URL to thumbnail image
  tags: string[];              // Array of tag strings
  relatedArticles: RelatedArticle[]; // Related article references
  content: string;             // Full article content (Markdown)
};

type RelatedArticle = {
  articleId: string;           // Related article's ID
  title: string;               // Related article's title
  subTitle: string | null;     // Related article's subtitle
};
```

## Field Descriptions

### Core Fields

#### `id`
- **Type**: `number`
- **Description**: Unique numeric identifier for the article
- **Generation**: Auto-incremented based on existing articles
- **Example**: `42`

#### `articleId`
- **Type**: `string`
- **Description**: URL-friendly identifier used in routing
- **Generation**: Slugified version of title (AI-enhanced when available)
- **Format**: Lowercase, hyphens instead of spaces, no special characters
- **Example**: `"notion-to-blog-converter-guide"`

#### `title`
- **Type**: `string`
- **Description**: Human-readable article title
- **Sources**: Notion page title, first heading, or AI-generated
- **Example**: `"Building a Notion to Blog Converter"`

### AI-Enhanced Fields

#### `subTitle`
- **Type**: `string | null`
- **Description**: Compelling subtitle that complements the title
- **Generation**: AI-analyzed from content or first paragraph
- **Example**: `"Streamline your content workflow with automated publishing"`

#### `description`
- **Type**: `string | null`
- **Description**: SEO-optimized meta description (150-160 characters)
- **Generation**: AI-extracted from content introduction
- **Purpose**: Search engine snippets and social sharing

#### `tags`
- **Type**: `string[]`
- **Description**: Content categorization tags
- **Generation**: AI-selected from existing blog tags based on content analysis
- **Selection Criteria**: Relevance to content, popularity in existing articles

### Metadata Fields

#### `publishedAt`
- **Type**: `string`
- **Format**: ISO 8601 timestamp
- **Example**: `"2024-01-15T10:30:00.000Z"`
- **Generation**: Current timestamp when article is created

#### `thumbnailUrl`
- **Type**: `string | null`
- **Description**: Path to article thumbnail image
- **Source**: First image found in Notion content
- **Format**: Relative path from public directory
- **Example**: `"/assets/notion-image-abc123.jpg"`

#### `relatedArticles`
- **Type**: `RelatedArticle[]`
- **Description**: References to related articles (max 3)
- **Selection**: Based on shared tags, sorted by recency
- **Purpose**: Internal linking and content discovery

### Content Field

#### `content`
- **Type**: `string`
- **Description**: Full article content in Markdown format
- **Processing**:
  - Extracted from Notion blocks
  - Images downloaded and paths updated
  - Rich text formatting preserved
- **Format**: GitHub Flavored Markdown

## File Naming Convention

Articles are saved as `{articleId}.json` in the `content/articles/` directory.

**Examples**:
- `notion-to-blog-converter-guide.json`
- `building-modern-web-apps.json`
- `2024-travel-highlights.json`

## Validation Rules

### Required Fields
- `id`: Must be unique positive integer
- `articleId`: Must be unique, URL-safe string
- `title`: Non-empty string
- `publishedAt`: Valid ISO 8601 timestamp
- `content`: Non-empty string

### Optional Fields
- `subTitle`: Can be null
- `description`: Can be null
- `thumbnailUrl`: Can be null

### Array Fields
- `tags`: Can be empty array
- `relatedArticles`: Can be empty array, max 3 items

## Example Article JSON

```json
{
  "id": 42,
  "articleId": "notion-to-blog-converter-guide",
  "title": "Building a Notion to Blog Converter",
  "subTitle": "Streamline your content workflow with automated publishing",
  "description": "Learn how to automatically convert Notion pages into structured blog articles with image processing and SEO optimization.",
  "publishedAt": "2024-01-15T10:30:00.000Z",
  "thumbnailUrl": "/assets/notion-converter-preview.jpg",
  "tags": ["tutorial", "automation", "web-development"],
  "relatedArticles": [
    {
      "articleId": "automating-content-workflows",
      "title": "Automating Content Workflows",
      "subTitle": "Tools and techniques for efficient publishing"
    }
  ],
  "content": "# Building a Notion to Blog Converter\n\nThis guide shows you how to...\n\n![Demo screenshot](/assets/demo-screenshot.jpg)\n\n## Getting Started\n\nFirst, you'll need to set up your Notion integration..."
}
```

## Integration Points

### Article Repository
- Articles are read by `ArticleRepository.getAllArticles()`
- Used by `ArticleQueryService` for queries and relationships
- Must maintain compatibility with existing article structure

### Image Assets
- Thumbnail and content images stored in `public/assets/`
- Paths are relative to the public directory
- Images are processed and renamed for uniqueness

### Tag System
- Tags are used for categorization and related article discovery
- Should match existing blog's tag conventions
- AI selection helps maintain consistency

## Migration Notes

When migrating from other systems:
1. Ensure `id` fields are unique across all articles
2. Convert timestamps to ISO 8601 format
3. Update image paths to relative URLs
4. Validate tag consistency
5. Test related article linking