import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SinglePost } from 'common-types';
import PostContent, { PostContentProps } from 'components/Post/PostContent';
import { API, WEB_TITLE } from 'config';
import GA_EVENTS from 'ga';
import getUriFromReqHeaders from 'lib/functions/getUriFromReqHeaders';
import MarkdownContentHandlers from 'lib/handlers/MarkdownContentHandlers';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React, { memo, useEffect, useMemo } from 'react';
import posts from 'static/posts';
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
  const { title, description, content } = props;
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
      <PostContent {...props} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = posts.map((p) => `/posts/${p.id}`);
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
