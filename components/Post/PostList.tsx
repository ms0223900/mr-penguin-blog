import { Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import PostCardItem from 'components/Post/PostCardItem';
import { API } from 'config';
import getUriFromReqHeaders from 'lib/functions/getUriFromReqHeaders';
import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { PostListResponse, SinglePostFromPostList } from 'pages/api/posts';
import React, { memo } from 'react';
import PostDetailCardItem from './PostDetailCardItem';

export interface PostListViewProps {
  postListData: SinglePostFromPostList[];
}

export const PostList = ({ postListData }: PostListViewProps) => (
  <Container
    style={{
      padding: '1rem',
    }}
  >
    <Grid container spacing={1}>
      {postListData.map((p) => (
        <Grid key={p.id} item padding={0.5} xs={12} md={12}>
          {/* <PostCardItem {...p} /> */}
          <PostDetailCardItem {...p} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

const PostListView = (props: PostListViewProps) => {
  return (
    <div>
      <Head>
        <title>{`Mr.Penguin | ${'Post List'}`}</title>
        <meta name="description" content={'Latest Posts'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostList {...props} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  PostListViewProps
> = async ({ req }) => {
  const uri = getUriFromReqHeaders(req.headers);
  const res = (await fetch(`${uri}/api/posts`).then((res) => res.json())) as {
    data: PostListResponse;
  };
  const postListData = res.data;

  return {
    props: {
      postListData,
    },
  };
};

export default memo(PostListView);
