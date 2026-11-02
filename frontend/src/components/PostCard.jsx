import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const excerpt =
    post.content.length > 160
      ? post.content.slice(0, 160).trimEnd() + "…"
      : post.content;

  return (
    <article className="card post-card">
      {post.coverImage && (
        <img className="card-img" src={post.coverImage} alt="" loading="lazy" />
      )}
      <div className="card-body">
        {post.tags?.length > 0 && (
          <div className="tags">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        )}
        <h2 className="card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="excerpt">{excerpt}</p>
        <div className="card-meta">
          <span className="author">{post.author?.name || "Unknown"}</span>
          <span className="dot-sep">•</span>
          <span>{date}</span>
          <span className="dot-sep">•</span>
          <span title="Likes">♥ {post.likes?.length || 0}</span>
        </div>
      </div>
    </article>
  );
}
