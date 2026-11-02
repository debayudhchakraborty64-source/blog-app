import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import PostForm from "../components/PostForm.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then(({ data }) => {
        if (user && String(data.author?._id) !== String(user._id)) {
          setNotAllowed(true);
        } else {
          setPost(data);
        }
      })
      .catch(() => navigate(`/posts/${id}`));
  }, [id, user, navigate]);

  if (notAllowed) {
    return <p className="empty">You can only edit your own posts.</p>;
  }
  if (!post) return <Loader />;

  const submit = async (payload) => {
    const { data } = await api.put(`/posts/${id}`, payload);
    navigate(`/posts/${data._id}`);
  };

  return (
    <div className="page-narrow">
      <h1>Edit post</h1>
      <PostForm initial={post} onSubmit={submit} submitLabel="Save changes" />
    </div>
  );
}
