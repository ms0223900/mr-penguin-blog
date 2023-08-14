import PostList from 'components/Post/PostList'; // getServerSideProps,

import { PostListViewProps } from 'components/Post/PostList';
import queryProjectTagArticles from 'gql/queryProjectTagArticles';
import QueriedArticleHandlers from 'lib/handlers/QueriedArticleHandlers';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps<PostListViewProps> = async (
  ctx
) => {
  try {
    const queried = await queryProjectTagArticles();

    const postListData = QueriedArticleHandlers.handleQueriedArticleList(
      queried.data.articles
    );

    return {
      props: {
        postListData,
      },
    };
  } catch (error) {
    return {
      props: {
        postListData: [],
      },
    };
  }
};

export default PostList;
