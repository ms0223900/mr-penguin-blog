import { gql } from '@apollo/client';
import { ID } from 'common-types';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { QueriedArticleList } from './queryArticleList';

export interface QueryArticleListOptions {
  paginationLimit?: number;
  articleUid?: ID;
}

const makeSchema = ({ paginationLimit = -1 }: QueryArticleListOptions) => gql`
  query GET_ARTICLE_WITH_ARTICLE_ID($tagName: StringFilterInput, , $articleUid: ID) {
    articles(filters: { 
      article_tags: { title: $tagName },
      and: {
        id: { lt: $articleUid }
      } 
      }, 
      pagination: { limit: ${paginationLimit} }, 
      sort: "id:desc") {
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
      articleUid: options?.articleUid,
    },
  });
};

export default queryArticleByTag;
