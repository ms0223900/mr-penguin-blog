import { gql } from '@apollo/client';

const ARTICLE_ENTITY = gql`
  fragment ARTICLE_ENTITY on ArticleEntity {
    id
    attributes {
      articleId
      title
      subTitle
      description
      publishedAt
      content
      thumbnailUrl
      article_tags {
        data {
          attributes {
            title
          }
        }
      }
      thumbnail {
        data {
          attributes {
            url
          }
        }
      }
      related_articles {
        data {
          id
          attributes {
            articleId
            title
            subTitle
          }
        }
      }
    }
  }
`;

export default ARTICLE_ENTITY;
