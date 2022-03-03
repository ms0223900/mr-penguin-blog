import { Box, Container, Typography } from '@mui/material';
import { SinglePost } from 'common-types';
import TagLinkItem from 'components/Common/TagLinkItem';
import { PostList } from 'components/Post/PostList';
import { WEB_TITLE } from 'config';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useMemo, useState } from 'react';
import posts from 'static/posts';

const useQueryPost = () => {
  // const { state } = useContext(MainContext);
  const router = useRouter();
  const searchVal = useMemo(
    () => decodeURIComponent(router.query.searchVal as string),
    [router.query]
  );
  const [postList, setPostList] = useState<SinglePost[]>([]);

  const handleQuery = (searchVal: string) => {
    console.log(searchVal);

    if (!searchVal) {
      setPostList([]);
      return [];
    }

    if (searchVal.includes('@')) {
      const res = posts.filter((p) =>
        p.tagList.includes(searchVal.replace('@', ''))
      );
      setPostList(res);
      return res;
    }

    const res = posts.filter((p) => {
      const contentsForSearch = [p.title, p.subTitle, p.content, p.description];
      for (const c of contentsForSearch) {
        if (c.includes(searchVal)) return true;
      }
    });
    setPostList(res);
    return res;
  };

  useEffect(() => {
    handleQuery(searchVal);
  }, [searchVal]);

  return {
    searchVal: searchVal,
    postList,
    handleQuery,
  };
};

export interface SearchedResultPageProps {
  headTitle: string;
}

const SearchedResultPage = ({ headTitle }: SearchedResultPageProps) => {
  const { searchVal, postList } = useQueryPost();
  const recommendedTagList = ['vue', 'nuxt3'];

  return (
    <Container>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Typography textAlign={'center'}>
        {`以下是搜尋: ${searchVal} 的結果`}
      </Typography>
      <hr />
      {postList.length > 0 && <PostList postListData={postList} />}
      {!postList.length && (
        <Box>
          <Typography
            variant="h5"
            style={{
              opacity: 0.6,
            }}
            textAlign={'center'}
          >
            {'找不到結果 :(\n，要不要試試看查這些關鍵字?'}
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
//   fallback: 'blocking',
// });

// export const getStaticProps: GetStaticProps<SearchedResultPageProps> = async (
//   ctx
// ) => {
//   const headTitle = `搜尋: ${ctx.params?.searchVal as string} | ${WEB_TITLE}`;

//   return {
//     props: {
//       headTitle,
//     },
//   };
// };

export const getServerSideProps: GetServerSideProps<
  SearchedResultPageProps
> = async (ctx) => {
  const headTitle = `搜尋: ${ctx.params?.searchVal as string} | ${WEB_TITLE}`;

  return {
    props: {
      headTitle,
    },
  };
};

export default memo(SearchedResultPage);
