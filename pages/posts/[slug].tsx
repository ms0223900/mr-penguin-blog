import { Grid, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { SinglePost } from 'common-types';
import PostContent, { PostContentProps } from 'components/Post/PostContent';
import PostHeaderList from 'components/Post/PostHeaderList';
import RelatedArticleLinkList, {
  RelatedArticleLinkListProps,
} from 'components/Post/RelatedArticleLinkList';
import { API, WEB_TITLE } from 'config';
import GA_EVENTS from 'ga';
import queryArticleByArticleId from 'gql/queryArticleByArticleId';
import queryArticleByTag from 'gql/queryArticleByTag';
import queryArticleList from 'gql/queryArticleList';
import MarkdownContentHandlers from 'lib/handlers/MarkdownContentHandlers';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React, { memo, useEffect, useMemo } from 'react';
import QueriedArticleHandlers from '../../lib/handlers/QueriedArticleHandlers';
import styles from './slug.module.scss';

export interface PostViewProps {
  post: PostContentProps;
  relatedPostListData: RelatedArticleLinkListProps;
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
  const { post, relatedPostListData } = props;
  const { title, description, content, thumbnail } = post;
  const classes = useStyles(props);

  useEffect(() => {
    GA_EVENTS.post.browse(post.id);
  }, [post.id]);

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
      <div className={styles['post-content--wrapper']}>
        <Grid
          container
          xs={12}
          columnSpacing={{
            xs: 0,
            lg: 8,
          }}
        >
          <Grid item xs={12} lg={9}>
            <PostContent {...post} />
            <Box padding={2} paddingTop={4}>
              <RelatedArticleLinkList {...relatedPostListData} />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            lg={3}
            paddingTop={10}
            className={styles['side-part']}
          >
            <section className={styles['header-list--wrapper']}>
              <PostHeaderList headerListData={headingList} />
            </section>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const getStaticPaths: GetStaticPaths = async () => {
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

const getStaticProps: GetStaticProps<PostViewProps> = async ({
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
    relatedArticleList: [],
  };
  if (res) {
    articleData = res;
  }

  let relatedPostListData = articleData.relatedArticleList;
  if (relatedPostListData.length <= 3) {
    const paginationLimit = 3 - relatedPostListData.length;
    const tagName = articleData.tagList[0];
    // console.log('paginationLimit: ', paginationLimit);
    // console.log('tagName: ', tagName);
    let otherPostListData = [];
    if (tagName) {
      otherPostListData = (
        await queryArticleByTag(tagName, {
          paginationLimit,
        })
      ).data.articles.data;
    } else {
      otherPostListData = (
        await queryArticleList({
          paginationLimit,
        })
      ).data.articles.data;
    }
    const handledOtherPostListData =
      QueriedArticleHandlers.handleQueriedArticleList({
        data: otherPostListData,
      });

    relatedPostListData = [...relatedPostListData, ...handledOtherPostListData];
  }
  // console.log('relatedPostListData: ', relatedPostListData);

  const props: PostViewProps = {
    post: articleData,
    relatedPostListData: {
      postListData: relatedPostListData,
    },
  };

  return {
    props,
  };
};

// const getServerSideProps: GetServerSideProps<PostViewProps> = async ({
//   params,
//   // req,
//   // resolvedUrl,
// }) => {
//   // const uri = getUriFromReqHeaders(req.headers);
//   const uri = API;
//   const postId = params?.slug as string;

//   // const res = {
//   //   data: getMatchedPost(postId),
//   // };
//   const queried = await queryArticleByArticleId(postId);
//   const res = queried.data.articles.data[0]
//     ? QueriedArticleHandlers.handleQueriedArticleList(queried.data.articles)[0]
//     : undefined;

//   let articleData: SinglePost = {
//     id: '',
//     subTitle: '',
//     title: 'NotFound',
//     description: 'Post not found',
//     content: '',
//     tagList: [],
//     createdAt: '',
//     thumbnail: null,
//   };
//   if (res) {
//     articleData = res;
//   }

//   return {
//     props: {
//       ...articleData,
//     },
//   };
// };

export { getStaticPaths };
export { getStaticProps };
// export { getServerSideProps };

export default memo(PostView);
