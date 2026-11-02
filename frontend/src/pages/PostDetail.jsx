import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [{ data: p }, { data: c }] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`),
      ]);
      setPost(p);
      setComments(c);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load post");
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error) return <p className="empty">{error}</p>;
  if (!post) return <Loader />;

  const isAuthor =
    user && String(post.author?._id) === String(user._id);
  const liked =
    user && post.likes?.some((u) => String(u) === String(user._id));

  const toggleLike = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/posts/${id}` } });
      return;
    }
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setPost((prev) => ({ ...prev, likes: data.likes }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update like");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/posts/${id}/comments`, {
        content: commentText.trim(),
      });
      setComments([data, ...comments]);
      setCommentText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      setComments((cs) => cs.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="post-page">
      {post.coverImage && (
        <img className="post-cover" src={post.coverImage} alt="" />
      )}

      <h1 className="post-title">{post.title}</h1>

      <div className="post-meta">
        <span className="author">{post.author?.name}</span>
        <span className="dot-sep">•</span>
        <span>{date}</span>
      </div>

      {post.tags?.length > 0 && (
        <div className="tags">
          {post.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="post-content">
        {post.content.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="post-actions">
        <button
          className={`btn ${liked ? "btn-gold" : "btn-outline"}`}
          onClick={toggleLike}
        >
          {liked ? "♥ Liked" : "♡ Like"} ({post.likes?.length || 0})
        </button>

        {isAuthor && (
          <>
            <Link className="btn btn-outline" to={`/posts/${post._id}/edit`}>
              Edit
            </Link>
            <button className="btn btn-danger" onClick={deletePost}>
              Delete
            </button>
          </>
        )}
      </div>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form className="form comment-form" onSubmit={addComment}>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
            />
            <button
              className="btn btn-gold"
              type="submit"
              disabled={!commentText.trim()}
            >
              Comment
            </button>
          </form>
        ) : (
          <p className="small">
            <Link to="/login">Log in</Link> to join the discussion.
          </p>
        )}

        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id} className="comment">
              <div className="comment-head">
                <span className="comment-author">
                  {c.author?.name || "Unknown"}
                </span>
                <span className="small">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
                {user &&
                  (String(c.author?._id) === String(user._id) || isAuthor) && (
                    <button
                      className="link danger"
                      onClick={() => deleteComment(c._id)}
                    >
                      ✕
                    </button>
                  )}
              </div>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
