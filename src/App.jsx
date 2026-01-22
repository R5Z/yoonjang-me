import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Logo from "./components/Logo";
import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import PostDetail from "./pages/PostDetail";

import { postsData } from "./data/postsData";

function App() {
  console.log("app got data:", postsData);

  return (
    <Router>
      <header className="main-header">
        <div className="header-inner">
          <Logo /> 
          <nav className="main-nav">
            <Link to="/">posts</Link>
            <Link to="/about">about</Link>
          </nav>
        </div>
      </header>

      <div className="content-area">
        <Routes>
          {/* postsData를 전달하여 Home에서 최신 6개를 보여줍니다. */}
          <Route path="/" element={<Home posts={postsData} />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      <footer className="main-footer">
        <div className="footer-inner">
          <span className="copyright">2026 © Jangmi Yoon</span>
        </div>
      </footer>
    </Router>
  );
}

export default App;