import {
  PostList,
  getServerSideProps,
  PostListViewProps,
} from 'components/Post/PostList';
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
        <title>{'Mr.Penguin'}</title>
        <meta name="description" content="Mr.Penguin Blog" />
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
