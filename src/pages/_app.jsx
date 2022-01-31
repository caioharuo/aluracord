import { GlobalStyle } from '../styles/GlobalStyles.jsx';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
