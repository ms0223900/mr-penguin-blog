import { API } from 'config';
import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { PostListResponse, SinglePostFromPostList } from 'pages/api/posts';
import React, { memo } from 'react';

export interface PostListViewProps {
  postListData: SinglePostFromPostList[];
}

const PostListView = ({ postListData }: PostListViewProps) => {
  return (
    <div>
      <Head>
        <title>{`Mr.Penguin | ${'Post List'}`}</title>
        <meta name="description" content={'Latest Posts'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {postListData.map((p) => (
          <Link key={p.id} href={`posts/${p.id}`} passHref>
            <a>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  PostListViewProps
> = async () => {
  const res = (await fetch(`${API}/api/posts`).then((res) => res.json())) as {
    data: PostListResponse;
  };
  const postListData = res.data;

  return {
    props: {
      postListData,
    },
  };
};

export default memo(PostListView);
