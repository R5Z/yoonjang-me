import PostDetail from '../../src/views/PostDetail';
import { getAllPosts, getPostById } from '../../lib/posts';

export default function PostPage(props) { return <PostDetail {...props} />; }

export async function getStaticPaths() {
  return {
    paths: getAllPosts().map(p => ({ params: { id: String(p.id) } })),
    fallback: false,
  };
}
export async function getStaticProps({ params }) {
  const data = getPostById(params.id);
  if (!data) return { notFound: true };
  return { props: data };
}