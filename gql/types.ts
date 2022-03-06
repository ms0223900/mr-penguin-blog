import { StrapiResponseWithListAttr } from 'common-types';

export interface SingleQueriedArticle {
  articleId: string;
  title: string;
  subTitle: string;
  description: string;
  publishedAt: string;
  content: string;
  thumbnailUrl?: string;
  article_tags: StrapiResponseWithListAttr<{
    title: string;
  }>;
  thumbnail: StrapiResponseWithListAttr<{
    url: string;
  }>;
}
