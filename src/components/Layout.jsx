import Link from "next/link";
import Logo from "./Logo";

export default function Layout({ children }) {
  return (
    <>
      <header className="main-header">
        <div className="header-inner">
          <Logo />
          <nav className="main-nav">
            <Link href="/posts">posts</Link>
            <Link href="/works">works</Link>
            <Link href="/about">about</Link>
          </nav>
        </div>
      </header>
      <div className="content-area">{children}</div>
      <footer className="main-footer">
        <div className="footer-inner">
          <span className="copyright">2026 © Jangmi Yoon</span>
        </div>
      </footer>
    </>
  );
}