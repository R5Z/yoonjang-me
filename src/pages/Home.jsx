import { Link } from "react-router-dom";

const Home = ({ posts = [] }) => {
  console.log("home got data:", posts);

  const latestPosts = posts.slice(0, 6);

  return (
    <div className="container">
      {latestPosts.map((post) => (
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
  );
};

export default Home;
