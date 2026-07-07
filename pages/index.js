import Home from '../src/views/Home';
import { getAllPostsWithComments, getAllTags } from '../lib/posts';

export default function HomePage({ posts, tags }) {
  return <Home posts={posts} tags={tags} />;
}

export async function getStaticProps() {
  return { props: { posts: await getAllPostsWithComments(), tags: getAllTags() } };
}