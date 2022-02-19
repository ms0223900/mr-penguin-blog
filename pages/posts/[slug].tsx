import { SinglePost } from 'common-types';
import PostContent, { PostContentProps } from 'components/Post/PostContent';
import GA_EVENTS from 'ga';
import getUriFromReqHeaders from 'lib/functions/getUriFromReqHeaders';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { memo, useEffect } from 'react';

export interface PostViewProps extends PostContentProps {
  title: string;
  description: string;
}

const PostView = (props: PostViewProps) => {
  const { title, description, content } = props;

  useEffect(() => {
    GA_EVENTS.post.browse(props.id);
  }, [props.id]);

  return (
    <div>
      <Head>
        <title>{`${title} | Mr.Penguin`}</title>
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
  req,
  resolvedUrl,
}) => {
  const uri = getUriFromReqHeaders(req.headers);

  const postId = params?.slug;
  const res = (await fetch(`${uri}/api/posts/${postId}`).then((res) =>
    res.json()
  )) as { data: SinglePost | null };

  let articleData: SinglePost = {
    id: '',
    subTitle: '',
    title: 'NotFound',
    description: 'Post not found',
    content: '',
    tagList: [],
    createdAt: '',
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
