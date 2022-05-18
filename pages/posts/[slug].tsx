import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SinglePost } from 'common-types';
import PostContent, { PostContentProps } from 'components/Post/PostContent';
import { API, WEB_TITLE } from 'config';
import GA_EVENTS from 'ga';
import queryArticleByArticleId from 'gql/queryArticleByArticleId';
import queryArticleList from 'gql/queryArticleList';
import MarkdownContentHandlers from 'lib/handlers/MarkdownContentHandlers';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React, { memo, useEffect, useMemo } from 'react';
import QueriedArticleHandlers from '../../lib/handlers/QueriedArticleHandlers';
import styles from './slug.module.scss';

export interface PostViewProps extends PostContentProps {
  title: string;
  description: string;
}

const useStyles = makeStyles<Theme, PostViewProps>(
  (theme) => ({
    root: {},
    tableList: {
      display: 'block',
      [theme.breakpoints.down('lg')]: {
        display: 'none',
      },
    },
  }),
  {
    name: 'CustomStyle',
  }
);

const PostView = (props: PostViewProps) => {
  const { title, description, content, thumbnail } = props;
  const classes = useStyles(props);

  useEffect(() => {
    GA_EVENTS.post.browse(props.id);
  }, [props.id]);

  const headingList = useMemo(
    () => MarkdownContentHandlers.getHeadingTxtWithIdList(content),
    [content]
  );

  return (
    <div>
      <Head>
        <title>{`${title} | ${WEB_TITLE}`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnail?.src} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul
        // className={classes.tableList}
        className={styles['table-list']}
        style={{
          position: 'fixed',
          top: 100,
        }}
      >
        {headingList.map((h) => (
          <li
            key={h.id}
            style={{
              paddingBottom: '0.75rem',
            }}
          >
            <a
              href={`#${h.txt}`}
              style={{
                paddingLeft: h.level * 20,
              }}
            >
              {h.txt}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles['post-content--wrapper']}>
        <PostContent {...props} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const paths = posts.map((p) => `/posts/${p.id}`);
  const queried = await queryArticleList();
  const paths = QueriedArticleHandlers.getArticleIdList(
    queried.data.articles
  ).map((id) => `/posts/${id}`);
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostViewProps> = async ({
  params,
  // req,
  // resolvedUrl,
}) => {
  // const uri = getUriFromReqHeaders(req.headers);
  const uri = API;
  const postId = params?.slug as string;

  // const res = {
  //   data: getMatchedPost(postId),
  // };
  const queried = await queryArticleByArticleId(postId);
  const res = queried.data.articles.data[0]
    ? QueriedArticleHandlers.handleQueriedArticleList(queried.data.articles)[0]
    : undefined;

  let articleData: SinglePost = {
    id: '',
    subTitle: '',
    title: 'NotFound',
    description: 'Post not found',
    content: '',
    tagList: [],
    createdAt: '',
    thumbnail: null,
  };
  if (res) {
    articleData = res;
  }

  return {
    props: {
      ...articleData,
    },
  };
};

export default memo(PostView);
