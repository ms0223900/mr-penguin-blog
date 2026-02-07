import { articleQueryService } from '@/repository/article/ArticleQueryService';
import PostList, { PostListViewProps } from 'components/Post/PostList';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps<PostListViewProps> = async (ctx) => {
  try {
    const postListData = articleQueryService.getArticleList();

    return {
      props: {
        postListData,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        postListData: [],
      },
    };
  }
};
export default PostList;
