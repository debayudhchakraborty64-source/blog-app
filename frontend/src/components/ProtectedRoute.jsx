import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    // Remember where the user was heading so login can send them back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
