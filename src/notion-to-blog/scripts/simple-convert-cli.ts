#!/usr/bin/env node

/**
 * Simple CLI Tool for Converting Notion Pages to Blog Articles
 *
 * Usage: node simple-convert-cli.js <page-id>
 *
 * This is a simplified version that avoids complex dependencies.
 */
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

const fs = require('fs').promises;
const path = require('path');

// Simple argument parsing
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node simple-convert-cli.js <page-id>');
    console.log('');
    console.log('Arguments:');
    console.log('  page-id    The Notion page ID to convert (required)');
    console.log('');
    console.log('Environment Variables:');
    console.log('  NOTION_TOKEN    Notion API integration token (required)');
    console.log('');
    console.log('Examples:');
    console.log('  node simple-convert-cli.js 12345678-abcd-1234-5678-123456789abc');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h    Show this help message');
    process.exit(0);
  }

  if (args.length !== 1) {
    console.error('❌ Error: Exactly one page ID is required');
    process.exit(1);
  }

  const pageId = args[0];

  // Basic validation for Notion page ID format (UUID v4)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(pageId)) {
    console.error('❌ Error: Invalid page ID format. Expected UUID format (e.g., 12345678-abcd-1234-5678-123456789abc)');
    process.exit(1);
  }

  return { pageId };
}

// Simple Notion page fetcher
async function fetchNotionPage(pageId: string) {
  const notionToken = process.env.NOTION_TOKEN;

  if (!notionToken) {
    throw new Error('NOTION_TOKEN environment variable is not set');
  }

  const notion = new Client({ auth: notionToken });

  console.log('🔍 Fetching page data from Notion...');
  const page = await notion.pages.retrieve({ page_id: pageId });

  console.log('📄 Fetching page content...');
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  return { page, blocks };
}

// Simple content extractor
function extractContent(blocks: any) {
  let content = '';

  for (const block of blocks.results) {
    if (block.type === 'paragraph') {
      const text = block.paragraph.rich_text.map((rt: any) => rt.plain_text).join('');
      if (text.trim()) {
        content += text + '\n\n';
      }
    } else if (block.type === 'heading_1') {
      const text = block.heading_1.rich_text.map((rt: any) => rt.plain_text).join('');
      content += '# ' + text + '\n\n';
    } else if (block.type === 'heading_2') {
      const text = block.heading_2.rich_text.map((rt: any) => rt.plain_text).join('');
      content += '## ' + text + '\n\n';
    } else if (block.type === 'heading_3') {
      const text = block.heading_3.rich_text.map((rt: any) => rt.plain_text).join('');
      content += '### ' + text + '\n\n';
    }
  }

  return content.trim();
}

// Simple article generator
function generateArticle(page: any, content: string) {
  const title = page.properties?.title?.title?.[0]?.plain_text || 'Untitled';

  const article = {
    id: Date.now(), // Simple ID generation
    articleId: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: title,
    subTitle: null,
    description: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
    content: content,
    publishedAt: new Date().toISOString(),
    thumbnailUrl: null,
    tags: [],
    relatedArticles: []
  };

  return article;
}

// Simple file saver
async function saveArticle(article: any) {
  const outputDir = 'content/articles';
  const assetsDir = 'public/assets';

  // Ensure directories exist
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });

  const fileName = `${article.articleId}.json`;
  const filePath = path.join(outputDir, fileName);

  await fs.writeFile(filePath, JSON.stringify(article, null, 2));

  console.log(`💾 Article saved to: ${filePath}`);

  return {
    articlePath: filePath,
    success: true
  };
}

async function main() {
  const { pageId } = parseArgs();

  console.log('🚀 Simple Notion to Blog Converter CLI\n');

  try {
    console.log(`📄 Converting Notion page: ${pageId}`);

    // Fetch page data
    const { page, blocks } = await fetchNotionPage(pageId);

    // Extract content
    console.log('📝 Extracting content...');
    const content = extractContent(blocks);

    // Generate article
    console.log('📄 Generating article...');
    const article = generateArticle(page, content);

    // Save article
    const saveResult = await saveArticle(article);

    if (saveResult.success) {
      console.log('\n🎉 Conversion completed successfully!');
      console.log('='.repeat(50));
      console.log(`Article ID: ${article.articleId}`);
      console.log(`Saved to: ${saveResult.articlePath}`);
      console.log(`Content length: ${content.length} characters`);
      console.log('='.repeat(50));
      console.log('\nNext steps:');
      console.log('1. Review the generated article JSON');
      console.log('2. Commit and push changes to your repository');
      console.log('3. The article is now ready for publication!');
    } else {
      console.error('\n❌ Save failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('💥 CLI execution failed:', error);
    process.exit(1);
  });
}