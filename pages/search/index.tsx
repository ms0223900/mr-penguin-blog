import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { SinglePost } from 'common-types';
import TagLinkItem from 'components/Common/TagLinkItem';
import { WEB_TITLE } from 'config';
import queryArticleByTag from 'gql/queryArticleByTag';
import queryArticleByVal from 'gql/queryArticleByVal';
import useSearchByVal from 'lib/custom-hooks/useSearchByVal';
import useToggle from 'lib/custom-hooks/useToggle';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import QueriedArticleHandlers from 'lib/handlers/QueriedArticleHandlers';
import React, { memo, useEffect, useState } from 'react';
import Script from 'next/script';
import PostList, {
  getStaticProps,
  PostListViewProps,
  // getServerSideProps,
} from 'components/Post/PostList';
export { getStaticProps };

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

export interface SearchedResultPageProps extends PostListViewProps { }

const SearchedResultPage = ({ postListData }: SearchedResultPageProps) => {
  const loading = false;
  // const { loading, searchVal, postList } = useQueryPost();
  const recommendedTagList = ['vue', 'nuxt3'];

  const hiddenPosts = postListData.map((p) => ({
    ...p,
    style: {
      display: 'none',
    },
  }));

  return (
    <Container>
      <Head>
        <title>{WEB_TITLE}</title>
      </Head>

      <Typography id="search-val-text" textAlign={'center'}>
        {`以下是搜尋: `}<span id="search-val"></span>{` 的結果`}
      </Typography>

      <Box id="loadingContainer" textAlign={'center'}>
        <CircularProgress />
      </Box>

      <hr />
      <Box id="notFoundContainer" display={'none'}>
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
      {postListData.length > 0 && <PostList postListData={hiddenPosts} />}
      <Script> {`
        (() => {
            const searchParams = new URLSearchParams(window.location.search);
            const searchVal = searchParams.get('q') || '';

            const postList = ${JSON.stringify(
        postListData.map((p) => ({
          id: p.id.toString(),
          title: p.title,
          subTitle: p.subTitle,
          description: p.description,
        }))
      )}

            const filteredPostList = postList.filter(
              (p) =>
                p.id.includes(searchVal) ||
                p.title.includes(searchVal) || 
                (p.subTitle && p.subTitle.includes(searchVal)) ||
                (p.description && p.description.includes(searchVal))
            )

            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.getElementById('loadingContainer').style.display = 'none';

                    document.title = '搜尋: ' + searchVal + ' | ' + document.title;
                    
                    const searchValElement = document.getElementById('search-val')
                    searchValElement.innerHTML = searchVal
                    filteredPostList.forEach(p => {
                        document.getElementById(p.id).style.display = 'block';
                    })

                    if(filteredPostList.length === 0) {
                        document.getElementById('notFoundContainer').style.display = 'block';
                    }
                }, 100)
            })
         })()
        `}
      </Script>
    </Container>
  );
};

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
//   paths: [],
//   fallback: false,
//   // fallback: 'blocking',
// });

// export const getServerSideProps: GetServerSideProps<
//   SearchedResultPageProps
// > = async (ctx) => {
//   const headTitle = `搜尋: ${ctx.params?.searchVal as string} | ${WEB_TITLE}`;

//   return {
//     props: {
//       headTitle,
//     },
//   };
// };

export default memo(SearchedResultPage);
