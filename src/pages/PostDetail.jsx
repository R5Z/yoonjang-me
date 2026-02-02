import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useParams } from 'react-router-dom';
import { postsData } from '../data/postsData';

const PostDetail = () => {
  const { postId } = useParams();
  const post = postsData.find((p) => String(p.id) === String(postId));

  if (!post) return <div className="container">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      {/* 상단 메타 정보: 날짜가 먼저, 그 다음 모든 태그 나열 */}
      <div className="post-meta" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '20px' }}>
        
        {/* 1. 날짜를 가장 먼저 배치 */}
        <span className="date">{post.date}</span>

        {/* 2. 태그 리스트를 그 뒤에 나열 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {post.tags && post.tags.map((tag, index) => (
            <span key={index} className="category">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h1 className="page-title" style={{ marginBottom: '60px' }}>
        {post.title}
      </h1>
      
      {/* 마크다운 본문 */}
      <div className="post-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostDetail;