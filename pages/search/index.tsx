import { Box, CircularProgress, Container, Typography } from '@mui/material';
import TagLinkItem from 'components/Common/TagLinkItem';
import { WEB_TITLE } from 'config';
import Head from 'next/head';
import React, { memo } from 'react';
import Script from 'next/script';
import PostList, {
  getStaticProps,
  PostListViewProps,
} from 'components/Post/PostList';
export { getStaticProps };

export type SearchedResultPageProps = PostListViewProps;

const SearchedResultPage = ({ postListData }: SearchedResultPageProps) => {
  const recommendedTagList = ['vue', 'nuxt3'];

  const hiddenPosts = postListData.map((p) => ({
    ...p,
    gridItemProps: {
      id: p.id,
      style: {
        display: 'none',
      },
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
      <Script id="search-script"> {`
        (() => {
            const searchParams = new URLSearchParams(window.location.search);
            const searchVal = searchParams.get('q') || '';

            const postList = ${JSON.stringify(
        postListData.map((p) => ({
          id: p.id.toString(),
          title: p.title,
          subTitle: p.subTitle,
        }))
      )}

            const filteredPostList = postList.filter(
              (p) =>
                p.id.includes(searchVal) ||
                p.title.includes(searchVal) || 
                (p.subTitle && p.subTitle.includes(searchVal))
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

export default memo(SearchedResultPage);
