import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { postsData } from '../data/postsData';

const PostDetail = () => {
  const { postId } = useParams();
  const post = postsData.find((p) => String(p.id) === String(postId));

  console.log("now url:", postId);
  console.log("all list:", postsData);

  if (!post) return <div className="container">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      {/* 이전에 맞춘 왼쪽 정렬이 그대로 유지됩니다 */}
      <div className="post-meta" style={{ marginBottom: '10px' }}>
        <span className="category">{post.category}</span>
        <span className="date">{post.date}</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: '60px' }}>{post.title}</h1>
      
      <div className="post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PostDetail;