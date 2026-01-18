import "./App.css";

function App() {
  const posts = [
    { id: 1, title: "블로그도 합니다.", date: "6월 28, 2023", category: "예술" },
    { id: 2, title: "작업기를 써볼까 합니다.", date: "6월 20, 2023", category: "디자인" },
    { id: 3, title: "테스트입니다.", date: "6월 15, 2023", category: "수학" },
  ];

  return (
    <div className="wrapper">
      <header className="main-header">
        <div className="logo">
          {/* 나중에 움직일 기호 로고 자리 */}
          <pre className="ascii-logo">
            {`//--//\n[ * ]\n\\\\--\\\\`}
          </pre>
        </div>
        <nav className="main-nav">
          <a href="#">about</a>
          <a href="#">post</a>
          <a href="#">contact</a>
        </nav>
      </header>

      <hr className="header-divider" />

      <main className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-row">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="date">{post.date}</span>
              <span className="category">{post.category}</span>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}

export default App;