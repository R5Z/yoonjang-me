import Posts from '../src/views/Posts';
import { getAllPostsWithComments } from '../lib/posts';

export default function PostsPage({ posts }) { return <Posts posts={posts} />; }

export async function getStaticProps() {
  return { props: { posts: await getAllPostsWithComments() } };
}