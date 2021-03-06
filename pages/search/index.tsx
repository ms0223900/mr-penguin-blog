import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { SinglePost } from 'common-types';
import TagLinkItem from 'components/Common/TagLinkItem';
import { PostList } from 'components/Post/PostList';
import { WEB_TITLE } from 'config';
import queryArticleByTag from 'gql/queryArticleByTag';
import queryArticleByVal from 'gql/queryArticleByVal';
import useSearchByVal from 'lib/custom-hooks/useSearchByVal';
import useToggle from 'lib/custom-hooks/useToggle';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import QueriedArticleHandlers from 'lib/handlers/QueriedArticleHandlers';
import React, { memo, useEffect, useState } from 'react';

const useQueryPost = () => {
  // const { state } = useContext(MainContext);
  const { toggle: loading, setToggle: setLoading } = useToggle();
  const { searchVal } = useSearchByVal();
  const [postList, setPostList] = useState<SinglePost[]>([]);

  const handleQuery = async (searchVal: string) => {
    if (!searchVal) {
      setPostList([]);
      return [];
    }

    try {
      setLoading(true);
      if (searchVal.includes('@')) {
        const tag = searchVal.replace('@', '');
        const queried = await queryArticleByTag(tag);
        const articles = QueriedArticleHandlers.handleQueriedArticleList(
          queried.data.articles
        );
        setPostList(articles);
        return articles;
      }
      const queried = await queryArticleByVal(searchVal);
      const articles = QueriedArticleHandlers.handleQueriedArticleList(
        queried.data.articles
      );
      setPostList(articles);
      return articles;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    // if (searchVal.includes('@')) {
    //   const res = posts.filter((p) =>
    //     p.tagList.includes(searchVal.replace('@', ''))
    //   );
    //   setPostList(res);
    //   return res;
    // }

    // const res = posts.filter((p) => {
    //   const contentsForSearch = [p.title, p.subTitle, p.content, p.description];
    //   for (const c of contentsForSearch) {
    //     if (c && c.includes(searchVal)) return true;
    //   }
    // });
  };

  useEffect(() => {
    handleQuery(searchVal);
  }, [searchVal]);

  return {
    loading,
    searchVal: searchVal,
    postList,
    handleQuery,
  };
};

export interface SearchedResultPageProps {
  headTitle?: string;
}

const SearchedResultPage = ({ headTitle }: SearchedResultPageProps) => {
  const { loading, searchVal, postList } = useQueryPost();
  const recommendedTagList = ['vue', 'nuxt3'];

  return (
    <Container>
      <Head>
        <title>{headTitle || `??????: ${searchVal} | ${WEB_TITLE}`}</title>
      </Head>
      <Typography textAlign={'center'}>
        {`???????????????: ${searchVal} ?????????`}
      </Typography>
      {loading && (
        <Box textAlign={'center'}>
          <CircularProgress />
        </Box>
      )}
      <hr />
      {postList.length > 0 && <PostList postListData={postList} />}
      {!postList.length && !loading && (
        <Box>
          <Typography
            variant="h5"
            style={{
              opacity: 0.6,
            }}
            textAlign={'center'}
          >
            {'??????????????? :(\n????????????????????????????????????????'}
          </Typography>
          <Box display={'flex'} justifyContent={'center'}>
            {recommendedTagList.map((t) => (
              <TagLinkItem key={t} tagName={t} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
//   paths: [],
//   fallback: false,
//   // fallback: 'blocking',
// });

export const getStaticProps: GetStaticProps<SearchedResultPageProps> = async (
  ctx
) => {
  const headTitle = `?????? | ${WEB_TITLE}`;

  return {
    props: {
      headTitle,
    },
  };
};

// export const getServerSideProps: GetServerSideProps<
//   SearchedResultPageProps
// > = async (ctx) => {
//   const headTitle = `??????: ${ctx.params?.searchVal as string} | ${WEB_TITLE}`;

//   return {
//     props: {
//       headTitle,
//     },
//   };
// };

export default memo(SearchedResultPage);
