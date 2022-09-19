import { gql } from '@apollo/client';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { QueriedArticleList } from './queryArticleList';

export interface QueryArticleListOptions {
  paginationLimit?: number;
}

const makeSchema = ({ paginationLimit = -1 }: QueryArticleListOptions) => gql`
  query GET_ARTICLE_WITH_ARTICLE_ID($tagName: StringFilterInput) {
    articles(filters: { article_tags: { title: $tagName } }, pagination: { limit: ${paginationLimit} }) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

const queryArticleByTag = (
  tagName: string,
  options?: QueryArticleListOptions
) => {
  return client.query<{ articles: QueriedArticleList }>({
    query: makeSchema({
      ...options,
    }),
    variables: {
      tagName: {
        contains: tagName,
      },
    },
  });
};

export default queryArticleByTag;
