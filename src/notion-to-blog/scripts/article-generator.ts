/**
 * Article Generator for Notion to Blog Converter
 *
 * Generates structured article JSON files with optional AI content analysis.
 */

import { PageContent } from '@/lib/notion/notion-page-content/types';
import { Article } from '@/repository/article/article.types';
import { articleQueryService } from '@/repository/article/ArticleQueryService';
import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';
import { AIContentAnalyzer } from './ai-content-analyzer';

export interface ArticleGenerationResult {
  success: boolean;
  article?: Article;
  articlePath?: string;
  error?: string;
}

export class ArticleGenerator {
  private outputDir: string;

  constructor(outputDir: string = 'content/articles') {
    this.outputDir = outputDir;
  }

  /**
   * Generate article with AI analysis
   */
  async generateArticleWithAIAnalysis(
    pageData: PageContent,
    processedContent: string,
    aiAnalyzer: AIContentAnalyzer,
    maxRelatedArticles: number = 3
  ): Promise<Article> {
    // Get basic article info
    const baseArticle = this.generateBaseArticle(pageData, processedContent, maxRelatedArticles);

    // Perform AI analysis
    console.log('🤖 Analyzing content with AI...');

    const aiResults = await aiAnalyzer.analyzeContent({
      title: baseArticle.title || '',
      content: processedContent,
      existingTags: this.getAllExistingTags(),
    });

    // Merge AI results with base article
    return {
      ...baseArticle,
      title: aiResults.title || baseArticle.title,
      subTitle: aiResults.subTitle,
      description: aiResults.description,
      articleId: aiResults.articleId || baseArticle.articleId,
      tags: aiResults.tags,
      relatedArticles: this.getRelatedArticles(aiResults.tags, maxRelatedArticles),
    };
  }

  /**
   * Generate article without AI analysis
   */
  async generateArticle(
    pageData: PageContent,
    processedContent: string,
    maxRelatedArticles: number = 3
  ): Promise<Article> {
    return this.generateBaseArticle(pageData, processedContent, maxRelatedArticles);
  }

  /**
   * Generate base article structure
   */
  private generateBaseArticle(
    pageData: PageContent,
    processedContent: string,
    maxRelatedArticles: number
  ): Article {
    const pageTitle = this.extractPageTitle(pageData);
    const articleId = this.generateArticleId(pageTitle, processedContent);
    const thumbnailUrl = this.extractThumbnailUrl(processedContent);

    // Get next available ID
    const nextId = this.getNextArticleId();

    // Find related articles (basic tag matching for now)
    const relatedArticles = this.getRelatedArticles([], maxRelatedArticles);

    return {
      id: nextId,
      articleId,
      title: pageTitle,
      subTitle: null, // Will be filled by AI if enabled
      description: null, // Will be filled by AI if enabled
      publishedAt: new Date().toISOString(),
      thumbnailUrl,
      tags: [], // Will be filled by AI if enabled
      relatedArticles,
      content: processedContent,
    };
  }

  /**
   * Extract title from Notion page
   */
  private extractPageTitle(pageData: PageContent): string {
    // Try to get title from page properties
    if (pageData.page?.properties?.title?.title?.[0]?.plain_text) {
      return pageData.page.properties.title.title[0].plain_text;
    }

    // Try to get title from page properties (alternative structure)
    if (pageData.page?.properties?.Name?.title?.[0]?.plain_text) {
      return pageData.page.properties.Name.title[0].plain_text;
    }

    // Fallback: extract from first heading in content
    const lines = pageData.content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2).trim();
      }
    }

    // Ultimate fallback
    return 'Untitled Article';
  }

  /**
   * Generate SEO-friendly article ID
   */
  private generateArticleId(title: string, content: string): string {
    // Try to use title first
    if (title && title !== 'Untitled Article') {
      return this.slugifyTitle(title);
    }

    // Fallback: extract from first heading
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return this.slugifyTitle(line.substring(2).trim());
      }
    }

    // Ultimate fallback: timestamp-based ID
    return `article-${Date.now()}`;
  }

  /**
   * Convert title to URL-friendly slug
   */
  private slugifyTitle(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'en',
    });
  }

  /**
   * Extract thumbnail URL from content (first image)
   */
  private extractThumbnailUrl(content: string): string | null {
    // Look for image references in content
    const imageRegex = /!\[.*?\]\(([^)]+)\)/;
    const match = content.match(imageRegex);

    if (match) {
      return match[1];
    }

    return null;
  }

  /**
   * Get next available article ID
   */
  private getNextArticleId(): number {
    try {
      const articles = articleQueryService.getArticleList();
      if (articles.length === 0) {
        return 1;
      }

      // Find the highest ID and add 1
      const maxId = Math.max(...articles.map(a => a.uid ? parseInt(a.uid.toString()) : 0));
      return maxId + 1;
    } catch (error) {
      // If we can't read existing articles, start from 1
      console.warn('Could not read existing articles, starting ID from 1');
      return 1;
    }
  }

  /**
   * Get all existing tags from articles
   */
  private getAllExistingTags(): string[] {
    try {
      const articles = articleQueryService.getArticleList();
      const allTags = new Set<string>();

      articles.forEach(article => {
        article.tagList.forEach(tag => allTags.add(tag));
      });

      return Array.from(allTags);
    } catch (error) {
      console.warn('Could not read existing tags');
      return [];
    }
  }

  /**
   * Get related articles based on tags
   */
  private getRelatedArticles(tags: string[], maxCount: number): Article['relatedArticles'] {
    if (tags.length === 0) {
      // Return most recent articles if no tags specified
      try {
        const articles = articleQueryService.getArticleList(0, maxCount);
        return articles.map(a => ({
          articleId: a.id,
          title: a.title,
          subTitle: a.subTitle,
        }));
      } catch (error) {
        return [];
      }
    }

    // Find articles with matching tags
    const relatedArticles: Article['relatedArticles'] = [];

    for (const tag of tags) {
      try {
        const taggedArticles = articleQueryService.getArticleListByTag(tag);
        for (const article of taggedArticles) {
          if (relatedArticles.length >= maxCount) break;

          // Avoid duplicates
          if (!relatedArticles.some(ra => ra.articleId === article.uid)) {
            relatedArticles.push({
              articleId: article.id,
              title: article.title,
              subTitle: article.subTitle,
            });
          }
        }
      } catch (error) {
        // Continue with other tags
      }

      if (relatedArticles.length >= maxCount) break;
    }

    return relatedArticles;
  }

  /**
   * Save article to file
   */
  async saveArticle(article: Article): Promise<ArticleGenerationResult> {
    try {
      // Ensure output directory exists
      await fs.ensureDir(this.outputDir);

      // Generate filename
      const filename = `${article.articleId}.json`;
      const filePath = path.join(this.outputDir, filename);

      // Write article to file
      await fs.writeJson(filePath, article, { spaces: 2 });

      return {
        success: true,
        article,
        articlePath: filePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while saving article',
      };
    }
  }
}