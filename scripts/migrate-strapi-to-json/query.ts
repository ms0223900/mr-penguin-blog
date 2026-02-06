import { gql } from 'graphql-request';

export const GET_ALL_ARTICLES = gql`
  query GET_ALL_ARTICLES {
    articles(pagination: { limit: 1000 }) {
      data {
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
              attributes {
                articleId
                title
                subTitle
              }
            }
          }
        }
      }
    }
  }
`;
