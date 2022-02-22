import {
  PostList,
  getServerSideProps,
  PostListViewProps,
} from 'components/Post/PostList';
import { WEB_TITLE } from 'config';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

export type HomeProps = PostListViewProps;

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{WEB_TITLE + "'s Blog"}</title>
        <meta name="description" content="Penguin Cho's Blog" />
        <meta
          name="google-site-verification"
          content="5Ub9XZ7Mr0dXhHacFeVAIsYKOgw5lQOcfX0KtqanCuM"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PostList {...props} />
      </main>
    </div>
  );
};

export { getServerSideProps };

export default Home;
