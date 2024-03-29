import '../styles/reset.css';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import NavHeader from 'components/Header/NavHeader';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Script from 'next/script';
import { initState } from 'context';
import { useState } from 'react';
import Footer from 'components/Common/Footer';

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  const [s, setS] = useState(initState);
  return (
    // <MainContext.Provider
    //   value={{
    //     state: s,
    //     setState: (newS) => {
    //       setS((s) => ({ ...s, ...newS }));
    //       return { ...s, ...newS };
    //     },
    //   }}
    // >
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XVVQ12K6T3"
      />
      <Script
        id={'gtag-scripts'}
        strategy={'afterInteractive'}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XVVQ12K6T3');
          `,
        }}
      />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5250428654349260"
        crossOrigin="anonymous"
        strategy={'beforeInteractive'}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavHeader />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </>
    // </MainContext.Provider>
  );
}

export default MyApp;
