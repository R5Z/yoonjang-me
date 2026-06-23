import { useState } from "react";
import { Link } from "react-router-dom";

const Posts = ({ posts = [] }) => {
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // 정렬 로직
  const sortedPosts = [...posts].sort((a, b) => {
  // 날짜 문자열을 표준 형식(YYYY-MM-DD)으로 변환
  const dateA = new Date(a.date.replace(/\. /g, '-')).getTime();
  const dateB = new Date(b.date.replace(/\. /g, '-')).getTime();

  if (sortType === "latest") {
    return dateB - dateA; // 최신 기준
  }
  if (sortType === "oldest") {
    return dateA - dateB; // 과거 기준
  }
  if (sortType === "category") {
    return (a.category || "").localeCompare(b.category || "");
  }
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
        <select 
          value={sortType}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="category">By Tag</option>
        </select>
      </div>

      {/* 포스트 리스트 */}
      <div className="posts-list">
        {currentPosts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-link">
            <article className="post-row">
              <h1 className="post-title">{post.title}</h1>
              <img src={post.imgUrl} alt="" className="post-preview-img" />
              <div className="post-meta">
                <span className="date">{post.date}</span>
                <span className="category">{post.category}</span>
              </div>
            </article>
          </Link>
        ))}
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
    </div>
  );
};

export default Posts;