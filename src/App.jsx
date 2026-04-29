import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Logo from "./components/Logo";
import "./App.css";

import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Works from './pages/Works';
import About from "./pages/About";
import PostDetail from "./pages/PostDetail";

import { postsData, allTags } from "./data/postsData";

function App() {
  console.log("app got data:", postsData);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        
        <header className="main-header">
          <div className="header-inner">
            <Logo /> 
            <nav className="main-nav">
              <Link to="/posts">posts</Link>
              <Link to="/works">works</Link>
              <Link to="/about">about</Link>
            </nav>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            {/* postsData Home에서 최신 6개 */}
            <Route path="/" element={<Home posts={postsData} tags={allTags} />} />
            <Route path="/posts" element={<Posts posts={postsData} />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/works" element={<Works />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Analytics />
        </div>

        <footer className="main-footer">
          <div className="footer-inner">
            <span className="copyright">2026 © Jangmi Yoon</span>
          </div>
        </footer>
      </Router>
    </HelmetProvider>
  );
}

export default App;