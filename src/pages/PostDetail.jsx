import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { postsData } from '../data/postsData';

const PostDetail = () => {
  const { postId } = useParams();
  const post = postsData.find((p) => String(p.id) === String(postId));

  // 페이지 이동 시 댓글 위젯을 다시 불러오기 위한 스크립트 설정
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cusdis.com/js/cusdis.es.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 컴포넌트가 바뀔 때 기존 스크립트 정리
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [postId]);

  if (!post) return <div className="container">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      {/* 기존 상단 메타 정보 및 제목 (왼쪽 정렬 유지) */}
      <div className="post-meta" style={{ marginBottom: '10px' }}>
        <span className="category">{post.category}</span>
        <span className="date">{post.date}</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: '60px' }}>{post.title}</h1>
      
      {/* 마크다운 본문 */}
      <div className="post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PostDetail;