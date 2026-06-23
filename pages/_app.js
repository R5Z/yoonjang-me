import { Analytics } from '@vercel/analytics/react';
import Layout from '../src/components/Layout';
import ScrollToTop from '../src/components/ScrollToTop';
import '../src/styles/App.css';
import '../src/styles/index.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ScrollToTop />
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}