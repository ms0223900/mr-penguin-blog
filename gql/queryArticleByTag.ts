import { gql } from '@apollo/client';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { QueriedArticleList } from './queryArticleList';

const schema = gql`
  query GET_ARTICLE_WITH_ARTICLE_ID($tagName: StringFilterInput) {
    articles(filters: { article_tags: { title: $tagName } }) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

const queryArticleByTag = (tagName: string) => {
  return client.query<{ articles: QueriedArticleList }>({
    query: schema,
    variables: {
      tagName: {
        contains: tagName,
      },
    },
  });
};

export default queryArticleByTag;
