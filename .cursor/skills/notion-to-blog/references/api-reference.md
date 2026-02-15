# Notion API Integration Reference

This document provides technical details about how the skill integrates with the Notion API.

## Overview

The skill uses the official `@notionhq/client` library to interact with Notion's API. It leverages the existing `lib/notion/notion-page-content` module for core Notion operations.

## Key Components

### NotionClientService
- **Purpose**: Handles API authentication and connection management
- **Configuration**: Uses `EnvNotionConfig` to read `NOTION_TOKEN` from environment
- **Methods**:
  - `testConnection()`: Verifies API connectivity
  - `getPage()`: Retrieves page metadata
  - `getAllBlocks()`: Fetches all content blocks recursively

### PageQueryService
- **Purpose**: Orchestrates page data retrieval
- **Methods**:
  - `getPageData()`: Combines page info and blocks into `PageContent`
  - `getPagesData()`: Batch processing for multiple pages

### NotionContentExtractor
- **Purpose**: Converts Notion blocks to plain text content
- **Supported Block Types**:
  - Paragraphs
  - Headings (H1, H2, H3)
  - Lists (bulleted, numbered)
  - Code blocks
  - Quotes
  - Callouts
  - Dividers

## Authentication

The skill requires a Notion integration token:

```bash
export NOTION_TOKEN="your_integration_token_here"
```

### Creating a Notion Integration

1. Go to [Notion Developers](https://developers.notion.com/)
2. Create a new integration
3. Copy the "Internal Integration Token"
4. Share your Notion pages with the integration
5. Set the token as an environment variable

## API Limits and Best Practices

- **Rate Limits**: Notion API has request limits; the skill includes error handling
- **Pagination**: Automatically handles block pagination for large pages
- **Caching**: Consider implementing caching for frequently accessed pages
- **Error Handling**: Robust error handling for network issues and API errors

## Data Flow

```
Notion Page → PageQueryService → ContentExtractor → ImageProcessor → ArticleGenerator → JSON File
```

## Troubleshooting

### Common Issues

1. **"NOTION_TOKEN is not configured"**
   - Ensure the environment variable is set correctly
   - Verify the integration has access to the page

2. **"Page not found"**
   - Check that the page ID is correct
   - Ensure the integration has been shared with the page

3. **"Rate limit exceeded"**
   - Implement retry logic with exponential backoff
   - Reduce request frequency

### Debug Mode

Enable detailed logging by setting:

```typescript
const logger = {
  info: console.log,
  error: console.error,
  success: console.log,
  warn: console.warn
};
```

## Page ID Formats

Notion supports multiple page ID formats:

- Full URL: `https://www.notion.so/workspace/Page-Title-1234567890abcdef`
- Page ID: `12345678-1234-1234-1234-123456789abc`
- UUID: `123456781234123412341234567890ab`

The skill accepts any of these formats.