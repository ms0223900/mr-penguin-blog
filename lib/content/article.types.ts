/**
 * Article contract for content layer.
 * Matches the JSON shape under content/articles/*.json (no Strapi fields).
 */

export type Article = {
  id: number;
  articleId: string;
  title: string;
  subTitle: string | null;
  description: string | null;
  publishedAt: string;
  thumbnailUrl: string | null;
  tags: string[];
  relatedArticles: {
    articleId: string;
    title: string;
    subTitle: string | null;
  }[];
  content: string;
};
