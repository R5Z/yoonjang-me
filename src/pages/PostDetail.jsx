import { useState, useEffect } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useParams } from 'react-router-dom';
import { postsData } from '../data/postsData';
import Comments from '../components/Comments';
import { supabase } from '../supabaseClient';

const PostDetail = () => {
  const { postId } = useParams();
  const post = postsData.find((p) => String(p.id) === String(postId));

  const [stats, setStats] = useState({ views: 0, likes: 0 });

useEffect(() => {
  const currentPostId = post?.id; // post 객체에서 id만 따로 추출
  if (!currentPostId) return;

  let isMounted = true;

  const updateAndFetchStats = async () => {
    try {
      // 조회수 증가
      await supabase.rpc('increment_views', { post_id: currentPostId });
      
      // 최신 통계 가져오기
      const { data } = await supabase
        .from('post_stats')
        .select('views, likes')
        .eq('id', currentPostId)
        .single();
      
      if (isMounted && data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  updateAndFetchStats();

  return () => {
    isMounted = false;
  };
}, [post?.id]);

  // 좋아요 클릭 핸들러
  const handleLike = async () => {
    await supabase.rpc('increment_likes', { post_id: post.id });
    setStats(prev => ({ ...prev, likes: prev.likes + 1 }));
  };

  if (!post) return <div className="container">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      {/* 상단 메타 정보: 날짜가 먼저, 그 다음 모든 태그 나열 */}
      <div className="post-meta" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '20px' }}>
        
        {/* 날짜, 통계 */}
        <span className="date">
          {post.date}
          <span style={{ marginLeft: '10px' }}>Views {stats.views}</span>
          <span
            onClick={handleLike}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '0.8rem' }}>· ♥ </span>
            Likes {stats.likes}
          </span>
        </span>


        {/* 태그 리스트를 그 뒤에 나열 */}
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

      {/* 댓글 섹션 추가 */}
      <Comments postId={postId} />
    </div>
  );
};

export default PostDetail;