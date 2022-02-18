import '../styles/reset.css';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import NavHeader from 'components/Header/NavHeader';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavHeader />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
