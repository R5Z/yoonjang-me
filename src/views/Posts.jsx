import { useState } from "react";
import Link from "next/link";
import RouletteFloating from "../components/RouletteFloating";


const Posts = ({ posts = [] }) => {
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // 정렬 로직
  const sortedPosts = [...posts].sort((a, b) => {
  const dateA = new Date(a.date.replace(/\. /g, '-')).getTime();
  const dateB = new Date(b.date.replace(/\. /g, '-')).getTime();

  if (sortType === "series") {
    if (a.series && b.series) {
      if (a.series !== b.series) return a.series.localeCompare(b.series);
      return a.seriesOrder - b.seriesOrder;
    }
    if (a.series && !b.series) return -1;
    if (!a.series && b.series) return 1;
    return dateB - dateA;
  }
  if (sortType === "latest") return dateB - dateA;
  if (sortType === "oldest") return dateA - dateB;
  if (sortType === "category") return (a.category || "").localeCompare(b.category || "");
  return 0;
});

  // 페이지네이션
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      {/* 정렬 컨트롤 - 첫 포스트와 같은 높이 */}
      <div className="posts-header">
        <div style={{ display: 'flex', gap: '12px', fontStyle: 'italic', fontSize: '14px', fontFamily: 'Georgia, "PT Serif", serif' }}>
          {[
            { key: 'series', label: 'Series' },
            { key: 'latest', label: 'Latest' },
            { key: 'oldest', label: 'Oldest' },
            { key: 'category', label: 'By Tag' },
          ].map(opt => (
            <span
              key={opt.key}
              onClick={() => { setSortType(opt.key); setCurrentPage(1); }}
              style={{
                cursor: 'pointer',
                color: sortType === opt.key ? '#00ff00' : '#8B8A80',
                fontWeight: sortType === opt.key ? 700 : 400,
              }}
            >
              {opt.label}
            </span>
          ))}
        </div>
      </div>

      {/* 포스트 리스트 */}
      <div className="posts-list">
        {currentPosts.map((post, idx) => {
          const prevPost = idx === 0 ? sortedPosts[indexOfFirstPost - 1] : currentPosts[idx - 1];
          const isNewSeriesGroup = post.series && post.series !== prevPost?.series;
          const isContinuing = isNewSeriesGroup && idx === 0 && post.series === prevPost?.series;
          const seriesTotal = post.series
            ? posts.filter(p => p.series === post.series).length
            : 0;

          return (
            <div key={post.id}>
              {isNewSeriesGroup && (
                <div style={{ fontSize: '13px', color: '#0000ff', fontWeight: 700, marginTop: '22px', marginBottom: '4px' }}>
                  {post.series} · {isContinuing ? '이어서' : `${seriesTotal}편`}
                </div>
              )}
              <Link href={`/post/${post.id}`} className="post-link">
                <article className="post-row">
                  <h1 className="post-title">
                    {post.title}
                    {post.hasComments && <span className="comment-dot" aria-label="댓글 있음">●</span>}
                  </h1>
                  <img src={post.imgUrl} alt="" className="post-preview-img" />
                  <div className="post-meta">
                    <span className="date">{post.date}</span>
                    <span className="category">{post.category}</span>
                  </div>
                </article>
              </Link>
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(c => c - 1)}
          >
            PREV
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(c => c + 1)}
          >
            NEXT
          </button>
        </div>
      )}

      {currentPosts.length === 0 && (
        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '60px' }}>
          No posts found.
        </p>
      )}
      <RouletteFloating posts={posts} />
    </div>
  );
};

export default Posts;