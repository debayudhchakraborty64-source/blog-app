import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm.jsx";
import api from "../api.js";

export default function NewPost() {
  const navigate = useNavigate();

  const submit = async (payload) => {
    const { data } = await api.post("/posts", payload);
    navigate(`/posts/${data._id}`);
  };

  return (
    <div className="page-narrow">
      <h1>Write a new post</h1>
      <PostForm onSubmit={submit} submitLabel="Publish" />
    </div>
  );
}
