import HomepageContainer from 'components/Homepage/HomepageContainer';
import {
  PostList,
  getStaticProps,
  PostListViewProps,
} from 'components/Post/PostList';
import { WEB_TITLE } from 'config';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';

export type HomeProps = PostListViewProps;

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  const titleStr = WEB_TITLE + "'s Blog";
  return (
    <div className={styles.container}>
      <Head>
        <title>{titleStr}</title>
        <meta property="og:title" content={titleStr} />
        <meta property="og:image" content={'./defaultThumbnail.jpg'} />
        <meta name="description" content="Penguin Cho's Blog" />
        <meta
          name="google-site-verification"
          content="5Ub9XZ7Mr0dXhHacFeVAIsYKOgw5lQOcfX0KtqanCuM"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <HomepageContainer postListData={props.postListData} />
      </main>
    </div>
  );
};

export { getStaticProps };

export default Home;
