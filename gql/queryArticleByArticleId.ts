import { gql } from '@apollo/client';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { QueriedArticleList } from './queryArticleList';

const schema = gql`
  query GET_ARTICLE_WITH_ARTICLE_ID($articleId: StringFilterInput) {
    articles(filters: { articleId: $articleId }) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

const queryArticleByArticleId = (articleId: string) => {
  return client.query<{ articles: QueriedArticleList }>({
    query: schema,
    variables: {
      articleId: {
        eq: articleId,
      },
    },
  });
};

export default queryArticleByArticleId;
