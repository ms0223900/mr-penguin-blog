import { Container, Grid, GridProps } from '@mui/material';
import PostCardItem from 'components/Post/PostCardItem';
import { WEB_TITLE } from 'config';
import queryArticleList from 'gql/queryArticleList';
import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import { SinglePostFromPostList } from 'pages/api/posts';
import QueriedArticleHandlers from 'lib/handlers/QueriedArticleHandlers';
import React, { memo } from 'react';
import posts from 'static/posts';
import PostDetailCardItem from './PostDetailCardItem';
import styles from './post-list.module.scss';

export interface PostListViewProps {
  postListData: (SinglePostFromPostList & {
    gridItemProps?: GridProps;
  })[];
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
    <div className={styles['post-list--wrapper']}>
      <Head>
        <title>{`${'文章列表'} | ${WEB_TITLE}`}</title>
        <meta name="description" content={'Latest Posts'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        style={{
          padding: '1rem',
        }}
      >
        <Grid container spacing={3} rowSpacing={6}>
          {props.postListData.map((p) => (
            <Grid key={p.id} item padding={0.5} xs={12} md={4} {...p.gridItemProps}>
              <PostCardItem {...p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

const isDEV = process.env.NODE_ENV === 'development';

const getStaticProps: GetStaticProps<PostListViewProps> = async (ctx) => {
  // const res = {
  //   data: posts,
  // };
  // const postListData = res.data;
  try {
    const queried = await queryArticleList();
    const postListData = QueriedArticleHandlers.handleQueriedArticleList(
      queried.data.articles
    );

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

const getServerSideProps: GetServerSideProps<PostListViewProps> = async (
  ctx
) => {
  // const res = {
  //   data: posts,
  // };
  // const postListData = res.data;
  try {
    const queried = await queryArticleList();
    const postListData = QueriedArticleHandlers.handleQueriedArticleList(
      queried.data.articles
    );

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

export { getStaticProps };
// export { getServerSideProps }

const Comp = memo(PostListView) as any;

export default Comp;
