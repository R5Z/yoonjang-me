import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import { PT_Serif } from 'next/font/google';
import Layout from '../src/components/Layout';
import ScrollToTop from '../src/components/ScrollToTop';
import '../src/styles/index.css';
import '../src/styles/App.css';

const pretendard = localFont({
  src: '../src/fonts/PretendardVariable.woff2',
  display: 'swap',
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-pretendard: ${pretendard.style.fontFamily};
          --font-serif: ${ptSerif.style.fontFamily};
        }
      `}</style>
      <Layout>
        <ScrollToTop />
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </>
  );
}