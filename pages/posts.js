import Posts from '../src/views/Posts';
import { getAllPosts } from '../lib/posts';
export default function PostsPage({ posts }) { return <Posts posts={posts} />; }
export async function getStaticProps() {
  return { props: { posts: getAllPosts() } };
}