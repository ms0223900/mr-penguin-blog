import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import NavHeader from 'components/Header/NavHeader';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavHeader />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
