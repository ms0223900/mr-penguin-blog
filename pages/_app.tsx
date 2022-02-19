import '../styles/reset.css';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import NavHeader from 'components/Header/NavHeader';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Script from 'next/script';
import Head from 'next/head';

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XVVQ12K6T3"
      />
      <Script
        id={'gtag-scripts'}
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
  
              gtag('config', 'G-XVVQ12K6T3');
            `,
        }}
      />
      <CssBaseline />
      <NavHeader />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
