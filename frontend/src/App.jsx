import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import NewPost from "./pages/NewPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function NotFound() {
  return (
    <div className="page-narrow">
      <h1>404</h1>
      <p className="empty">That page doesn't exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Inkwell — built with the MERN stack
      </footer>
    </div>
  );
}
