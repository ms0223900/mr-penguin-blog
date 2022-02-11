import React, { memo } from 'react'
import PostContent, { PostContentProps } from 'components/Post/PostContent'
import { GetStaticPaths, GetStaticProps } from 'next'
import mockArticle from 'static/mock/mock-article'
import Head from 'next/head'
import { PostResponse } from 'pages/api/posts/[post_id]'
import { API } from 'config'

export interface PostViewProps extends PostContentProps {
  title: string
  description: string
}

const PostView = ({
  title,
  description,
  content
}: PostViewProps) => {
  return (
    <div>
      <Head>
        <title>{`Mr.Penguin | ${title}`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostContent content={content} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return ({
    paths: [
      '/posts/2022-02-10',
      '/posts/2022-02-09',
    ],
    fallback: 'blocking',
  })
}

export const getStaticProps: GetStaticProps<PostViewProps> = async ({ params }) => {
  const postId = params?.slug;
  const res = await fetch(`${API}/api/posts/${postId}`).then(res => res.json()) as ({ data: PostResponse | null});

  let articleData: PostResponse = {
    id: '',
    title: 'NotFound',
    description: 'Post not found',
    content: '',
  }
  if(res.data) {
    articleData = res.data;
  }

  return ({
    props: {
      ...articleData,
    }
  })
}

export default memo(PostView)