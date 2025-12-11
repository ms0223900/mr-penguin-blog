require('dotenv').config();

const STRAPI_URL = 'https://peaceful-hollows-08572.herokuapp.com/graphql';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

module.exports = {
  API_TOKEN,
  STRAPI_URL
};
