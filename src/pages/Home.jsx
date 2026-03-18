import { useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ posts = [], tags = [] }) => {
  // 선택된 태그 상태 관리 (null이면 전체 보기)
  const [selectedTag, setSelectedTag] = useState(null);

  // 태그 선택/해제 핸들러
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilter = () => {
    setSelectedTag(null);
  };

  // 필터링 로직: 선택된 태그가 있다면 해당 태그를 포함한 포스트만 추출
  const filteredPosts = selectedTag
    ? posts.filter((post) => 
        post.tags.map(t => t.toUpperCase()).includes(selectedTag.toUpperCase())
      )
    : posts.slice(0, 6); // 선택된 태그가 없으면 최신 6개 유지

  return (
    <div className="container">
      {/* 포스트 리스트 */}
      <section className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-link">
              <article className="post-row">
                <h1 className="post-title">{post.title}</h1>
                {post.imgUrl && <img src={post.imgUrl} alt="" className="post-preview-img" />}
                <div className="post-meta">
                  <span className="date">{post.date}</span>
                  <span className="category">{post.category}</span>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div style={{ padding: '40px 0', color: '#888' }}>해당 태그의 포스트가 없습니다.</div>
        )}
      </section>

      {/* 태그 클라우드 */}
      <section 
        className="all-tags-section" 
        style={{ 
          marginTop: '40px', 
          paddingTop: '40px'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {selectedTag ? (
            /* 선택된 태그 + 끄기 버튼 조합 */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                className="category" 
                style={{ background: '#0000ff', color: '#fff', cursor: 'default' }}
              >
                {selectedTag}
              </span>
              <button 
                onClick={clearFilter}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            /* 전체 태그 나열 */
            tags.map((tag, index) => (
              <span 
                key={index} 
                className="category" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;