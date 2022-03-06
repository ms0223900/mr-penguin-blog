import { ApolloClient, InMemoryCache } from '@apollo/client';
import { API } from 'config';

const client = new ApolloClient({
  uri: `${API}/graphql`,
  cache: new InMemoryCache(),
});

export default client;
