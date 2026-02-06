/**
 * Content layer: read articles from content/articles/*.json.
 * Pure Node (no React). Testable in isolation.
 */

import fs from 'fs';
import path from 'path';
import { Article } from './article.types';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR);

  return files
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const fullPath = path.join(ARTICLES_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(raw) as Article;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleById(articleId: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${articleId}.json`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as Article;
}
