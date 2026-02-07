import { Container, Grid, GridProps } from '@mui/material';
import PostCardItem from 'components/Post/PostCardItem';
import { WEB_TITLE } from 'config';
import Head from 'next/head';
import { SinglePostFromPostList } from 'pages/api/posts';
import { memo } from 'react';
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

const Comp = memo(PostListView) as any;

export default Comp;
