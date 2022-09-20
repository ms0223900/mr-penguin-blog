import { ID, SinglePost, StrapiResponseWithListAttr } from 'common-types';

export type SingleQuriedSimpleArticle = Pick<
  SingleQueriedArticle,
  'articleId' | 'title' | 'subTitle'
>;

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
  related_articles: StrapiResponseWithListAttr<
    Pick<SingleQueriedArticle, 'articleId' | 'title' | 'subTitle'>
  >;
}
