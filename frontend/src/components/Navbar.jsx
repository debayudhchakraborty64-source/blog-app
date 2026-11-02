import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-nib">🖋</span> Inkwell
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/write" className="btn btn-gold">
                + Write
              </NavLink>
              <span className="avatar" title={user.name}>
                {initials}
              </span>
              <button className="link" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="link">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-outline">
                Get started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
