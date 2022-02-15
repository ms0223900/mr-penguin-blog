import React, { memo } from 'react';
import PostContent, { PostContentProps } from 'components/Post/PostContent';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import mockArticle from 'static/mock/mock-article';
import Head from 'next/head';
import { PostResponse } from 'pages/api/posts/[post_id]';
import { API } from 'config';
import { SinglePost } from 'common-types';

export interface PostViewProps extends PostContentProps {
  title: string;
  description: string;
}

const PostView = (props: PostViewProps) => {
  const { title, description, content } = props;
  return (
    <div>
      <Head>
        <title>{`Mr.Penguin | ${title}`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostContent {...props} />
    </div>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   return ({
//     paths: [
//       '/posts/2022-02-10',
//       '/posts/2022-02-09',
//     ],
//     fallback: 'blocking',
//   })
// }

export const getServerSideProps: GetServerSideProps<PostViewProps> = async ({
  params,
}) => {
  const postId = params?.slug;
  const res = (await fetch(`${API}/api/posts/${postId}`).then((res) =>
    res.json()
  )) as { data: SinglePost | null };

  let articleData: SinglePost = {
    id: '',
    subTitle: '',
    title: 'NotFound',
    description: 'Post not found',
    content: '',
  };
  if (res.data) {
    articleData = res.data;
  }

  return {
    props: {
      ...articleData,
    },
  };
};

export default memo(PostView);
