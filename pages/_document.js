import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta name="google-site-verification" content="d7ffzCOOp8Ht5X9AL5Bk8ZmcsltYnsn7GV49gayohPk" />
        <link rel="icon" type="image/x-icon" href="/fav.ico" />
        <link rel="alternate" type="application/rss+xml" title="yoonjang.me" href="https://yoonjang.me/rss.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}