import About from '../src/views/About';
import { getBlogrollWithUpdates } from '../lib/blogroll';

export default function AboutPage({ blogrollSites }) {
  return <About blogrollSites={blogrollSites} />;
}

export async function getStaticProps() {
  return {
    props: { blogrollSites: await getBlogrollWithUpdates() },
    revalidate: 3600, // 1시간마다 백그라운드 재생성
  };
}