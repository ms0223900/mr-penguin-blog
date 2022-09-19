import { gql } from '@apollo/client';
import { StrapiResponseWithListAttr } from 'common-types';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { SingleQueriedArticle } from './types';
export interface QueryArticleListOptions {
  paginationLimit?: number;
}

const makeSchema = ({ paginationLimit = -1 }: QueryArticleListOptions) => gql`
  query GET_ARTICLE_LIST {
    # Write your query or mutation here
    articles(sort: ["publishedAt:desc"], pagination: { limit: ${paginationLimit} }) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

export type QueriedArticleList =
  StrapiResponseWithListAttr<SingleQueriedArticle>;

const queryArticleList = (options?: QueryArticleListOptions) =>
  client.query<{ articles: QueriedArticleList }>({
    query: makeSchema({
      ...options,
    }),
  });

export default queryArticleList;
