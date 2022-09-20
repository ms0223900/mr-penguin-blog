import { gql } from '@apollo/client';

const SIMPLE_ARTICLE_ENTITY = gql`
  fragment SIMPLE_ARTICLE_ENTITY on ArticleEntity {
    id
    attributes {
      articleId
      title
      subTitle
      description
      publishedAt
    }
  }
`;

export default SIMPLE_ARTICLE_ENTITY;
