import { gql } from '@apollo/client';
import client from 'gql';
import ARTICLE_ENTITY from './fragments/article';
import { QueriedArticleList } from './queryArticleList';

const schema = gql`
  query GET_ARTICLE_WITH_ARTICLE_ID($val: StringFilterInput) {
    articles(
      filters: { or: [{ title: $val }, { subTitle: $val }, { content: $val }] }
    ) {
      data {
        ...ARTICLE_ENTITY
      }
    }
  }
  ${ARTICLE_ENTITY}
`;

const queryArticleByVal = (val: string) => {
  return client.query<{ articles: QueriedArticleList }>({
    query: schema,
    variables: {
      val: {
        contains: val,
      },
    },
  });
};

export default queryArticleByVal;
