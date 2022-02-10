import React, { memo } from 'react'
import PostContent, { PostContentProps } from 'components/Post/PostContent'
import { GetStaticPaths, GetStaticProps } from 'next'
import mockArticle from 'static/mock/mock-article'
import Head from 'next/head'

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
      '/posts/abc'
    ],
    fallback: 'blocking',
  })
}

export const getStaticProps: GetStaticProps<PostViewProps> = async ({ params }) => {
  const postId = params?.slug
  console.log(postId)

  return ({
    props: {
      ...mockArticle,
    }
  })
}

export default memo(PostView)