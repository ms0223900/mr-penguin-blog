import { gql } from '@apollo/client';
import { StrapiResponseWithListAttr } from 'common-types';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { SingleQueriedArticle } from './types';

const schema = gql`
  query GET_ARTICLE_LIST {
    # Write your query or mutation here
    articles(sort: ["publishedAt:desc"]) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

export type QueriedArticleList =
  StrapiResponseWithListAttr<SingleQueriedArticle>;

const queryArticleList = () =>
  client.query<{ articles: QueriedArticleList }>({
    query: schema,
  });

export default queryArticleList;
