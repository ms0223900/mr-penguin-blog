/**
 * One-time migration: Strapi GraphQL → content/articles/*.json
 *
 * Usage:
 *   STRAPI_ENDPOINT=https://your-strapi/graphql [STRAPI_TOKEN=xxx] npm run migrate
 *
 * If STRAPI_ENDPOINT is not set, falls back to config.API + '/graphql'.
 */

import dotenv from 'dotenv';
import fs from 'fs-extra';
import { GraphQLClient } from 'graphql-request';
import path from 'path';
import slugify from 'slugify';
import { GET_ALL_ARTICLES } from './query';

dotenv.config();

/** Set STRAPI_ENDPOINT or default to local Strapi. */
const STRAPI_ENDPOINT =
  process.env.STRAPI_ENDPOINT || 'http://localhost:1337/graphql';

const OUTPUT_DIR = path.resolve(process.cwd(), 'content/articles');

type ArticleEntity = {
  id: string;
  attributes: {
    articleId: string;
    title: string;
    subTitle?: string;
    description?: string;
    publishedAt: string;
    content: string;
    thumbnailUrl?: string;
    article_tags?: {
      data: { attributes: { title: string } }[];
    };
    thumbnail?: {
      data?:
      | { attributes: { url: string } }
      | { attributes: { url: string } }[];
    };
    related_articles?: {
      data: {
        attributes: {
          articleId: string;
          title: string;
          subTitle?: string;
        };
      }[];
    };
  };
};

function getThumbnailUrl(a: ArticleEntity['attributes']): string | null {
  if (a.thumbnailUrl) return a.thumbnailUrl;
  const thumb = a.thumbnail?.data;
  if (!thumb) return null;
  const attrs = Array.isArray(thumb) ? thumb[0]?.attributes : thumb?.attributes;
  return attrs?.url ?? null;
}

async function run() {
  const client = new GraphQLClient(STRAPI_ENDPOINT, {
    headers: process.env.STRAPI_TOKEN
      ? { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
      : {},
  });

  await fs.ensureDir(OUTPUT_DIR);

  const { articles } = await client.request<{
    articles: { data: ArticleEntity[] };
  }>(GET_ALL_ARTICLES);

  for (const article of articles.data) {
    const a = article.attributes;

    const fileName = slugify(a.articleId, { lower: true });
    const filePath = path.join(OUTPUT_DIR, `${fileName}.json`);

    const output = {
      id: Number(article.id),
      articleId: a.articleId,
      title: a.title,
      subTitle: a.subTitle ?? null,
      description: a.description ?? null,
      publishedAt: a.publishedAt,
      thumbnailUrl: getThumbnailUrl(a),
      tags: a.article_tags?.data.map((t) => t.attributes.title) ?? [],
      relatedArticles:
        a.related_articles?.data.map((r) => ({
          articleId: r.attributes.articleId,
          title: r.attributes.title,
          subTitle: r.attributes.subTitle ?? null,
        })) ?? [],
      content: a.content ?? '',
    };

    await fs.writeJson(filePath, output, { spaces: 2 });
    console.log(`✔ migrated: ${fileName}`);
  }

  console.log('🎉 All articles migrated.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
