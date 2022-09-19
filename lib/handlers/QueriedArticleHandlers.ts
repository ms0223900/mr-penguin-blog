import { Image, SinglePost, StrapiResponseWithListAttr } from 'common-types';
import { QueriedArticleList } from 'gql/queryArticleList';
import { SingleQueriedArticle } from 'gql/types';

const QueriedArticleHandlers = (() => {
  const getThumbnail = (
    article: SingleQueriedArticle
  ): SinglePost['thumbnail'] => {
    if (article.thumbnailUrl)
      return {
        src: article.thumbnailUrl,
      };
    if (article.thumbnail.data[0])
      return {
        src: article.thumbnail.data[0].attributes.url,
      };
    return null;
  };

  const getTagList = (
    articleTagList: StrapiResponseWithListAttr<{ title: string }>
  ): string[] => articleTagList.data.map((t) => t.attributes.title);

  const handleQueriedArticleList = (
    queried: QueriedArticleList
  ): SinglePost[] => {
    const { data: articles } = queried;
    const res = articles.map(
      (a): SinglePost => ({
        ...a.attributes,
        id: a.attributes.articleId.toString(),
        createdAt: a.attributes.publishedAt,
        thumbnail: getThumbnail(a.attributes),
        tagList: getTagList(a.attributes.article_tags),
        relatedArticleList: a.attributes.related_articles.data.map((a) => ({
          ...a.attributes,
          id: a.attributes.articleId.toString(),
        })),
      })
    );

    return res;
  };

  const getArticleIdList = (queried: QueriedArticleList): string[] =>
    queried.data.map((a) => a.attributes.articleId);

  return {
    handleQueriedArticleList,
    getArticleIdList,
  };
})();

export default QueriedArticleHandlers;
