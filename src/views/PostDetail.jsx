import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Comments from '../components/Comments';
import { supabase } from '../supabaseClient';

const PostDetail = ({ post, prevPost, nextPost }) => {
  const [stats, setStats] = useState({ views: 0, likes: 0 });

  useEffect(() => {
    if (!post?.id) return;
    let isMounted = true;
    const run = async () => {
      try {
        await supabase.rpc('increment_views', { post_id: post.id });
        const { data } = await supabase
          .from('post_stats').select('views, likes')
          .eq('id', post.id).single();
        if (isMounted && data) setStats(data);
      } catch (e) { console.error("Stats error:", e); }
    };
    run();
    return () => { isMounted = false; };
  }, [post?.id]);

  const handleLike = async () => {
    if (!post) return;
    await supabase.rpc('increment_likes', { post_id: post.id });
    setStats(prev => ({ ...prev, likes: prev.likes + 1 }));
  };

  const description = post?.content
    ? post.content.substring(0, 150).replace(/[#*`]/g, '')
    : "포스트를 불러오는 중입니다.";

  if (!post) return <div className="container">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      <Head>
        <title>{`${post.title} | yoonjang.me`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        {post.imgUrl && <meta property="og:image" content={post.imgUrl} />}
      </Head>

      <div className="post-meta" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span className="date">
          {post.date}
          <span style={{ marginLeft: '10px' }}>Views {stats.views}</span>
          <span onClick={handleLike} style={{ marginLeft: '10px', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem' }}>· ♥ </span>Likes {stats.likes}
          </span>
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {post.tags && post.tags.map((tag, i) => (
            <span key={i} className="category">{tag}</span>
          ))}
        </div>
      </div>

      <h1 className="page-title" style={{ marginBottom: '60px' }}>{post.title}</h1>

      <div className="post-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <nav className="post-navigation" style={{
        display: 'flex', justifyContent: 'space-between', gap: '20px',
        marginTop: '100px', paddingTop: '40px', borderTop: '1px solid #aaa'
      }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {prevPost && (
            <Link href={`/post/${prevPost.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '1px' }}>PREVIOUS</span>
              <h4 style={{ margin: '5px 0 0', fontSize: '0.95rem', fontWeight: '400', lineHeight: '1.4' }}>← {prevPost.title}</h4>
            </Link>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          {nextPost && (
            <Link href={`/post/${nextPost.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '1px' }}>NEXT</span>
              <h4 style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: '400', lineHeight: '1.4' }}>{nextPost.title} →</h4>
            </Link>
          )}
        </div>
      </nav>

      <Comments postId={post.id} />
    </div>
  );
};

export default PostDetail;