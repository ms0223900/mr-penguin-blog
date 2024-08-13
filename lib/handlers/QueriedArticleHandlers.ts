import { ID, SingleBasicPostLinkData, SinglePost, StrapiResponseWithListAttr, } from 'common-types';
import { QueriedArticleList } from 'gql/queryArticleList';
import { QueriedReadMoreArticleList } from 'gql/queryReadMoreArticleList';
import { SingleQueriedArticle, SingleQuriedSimpleArticle } from 'gql/types';
import { SinglePostVO } from "lib/handlers/SinglePostVO";

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

    const convertSingleQuriedSimpleArticle = (
        uid: ID,
        simpleArticle: SingleQuriedSimpleArticle
    ): SingleBasicPostLinkData => {
        return {
            ...simpleArticle,
            uid,
            id: simpleArticle.articleId.toString(),
        };
    };

    const handleQueriedArticleList = (
        queried: QueriedArticleList
    ): SinglePost[] => {
        const { data: articles } = queried;
        const res = articles.map(
            (a): SinglePost => {
                const singlePostVO = new SinglePostVO({
                    ...a.attributes,
                    ...convertSingleQuriedSimpleArticle(a.id, a.attributes),
                    createdAt: a.attributes.publishedAt,
                    thumbnail: getThumbnail(a.attributes),
                    tagList: getTagList(a.attributes.article_tags),
                    relatedArticleList: a.attributes.related_articles.data.map((a) => ({
                        ...a.attributes,
                        uid: a.id,
                        id: a.attributes.articleId.toString(),
                    })),
                });
                return singlePostVO.value
            }
        );

        return res;
    };

    const convertQueriedSimpleArticleList = (
        queried: QueriedReadMoreArticleList
    ): SingleBasicPostLinkData[] => {
        const { data: articles } = queried;
        return articles.map((a) => ({
            ...a.attributes,
            ...convertSingleQuriedSimpleArticle(a.id, a.attributes),
        }));
    };

    const getArticleIdList = (queried: QueriedArticleList): string[] =>
        queried.data.map((a) => a.attributes.articleId);

    return {
        handleQueriedArticleList,
        getArticleIdList,
        convertQueriedSimpleArticleList,
    };
})();

export default QueriedArticleHandlers;
