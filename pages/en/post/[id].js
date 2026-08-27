import PostDetail from '../../../src/views/PostDetail';
import { getAllEnglishPostIds, getPostByIdEn } from '../../../lib/posts';

export default function PostPageEn(props) { return <PostDetail {...props} isEnglish={true} />; }

export async function getStaticPaths() {
  return {
    paths: getAllEnglishPostIds().map(id => ({ params: { id } })),
    fallback: false,
  };
}
export async function getStaticProps({ params }) {
  const post = getPostByIdEn(params.id);
  if (!post) return { notFound: true };
  return { props: { post, prevPost: null, nextPost: null } };
}