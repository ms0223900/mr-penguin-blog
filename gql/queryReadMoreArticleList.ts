import { gql } from '@apollo/client';
import { ID, StrapiResponseWithListAttr } from 'common-types';
import client from 'gql';
import SIMPLE_ARTICLE_ENTITY from './fragments/simpleArticle';
import { SingleQueriedArticle } from './types';

const makeSchema = () => gql`
  query QUERY_READ_MORE_ARTICLE_LIST($id: ID) {
    articles(
      filters: { or: [{ id: { gt: $id } }, { id: { lt: $id } }] }
      pagination: { limit: 3 }
      sort: "id:desc"
    ) {
      data {
        ...SIMPLE_ARTICLE_ENTITY
      }
    }
  }
  ${SIMPLE_ARTICLE_ENTITY}
`;

export type QueriedReadMoreArticleList = StrapiResponseWithListAttr<
  Pick<SingleQueriedArticle, 'articleId' | 'title' | 'subTitle'>
>;

const queryReadMoreArticleList = async (uid: ID) =>
  client.query<{ articles: QueriedReadMoreArticleList }>({
    query: makeSchema(),
    variables: {
      id: Number(uid),
    },
  });

export default queryReadMoreArticleList;
