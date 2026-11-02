import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Welcome back</h1>

      <form className="form" onSubmit={onSubmit} noValidate>
        {error && <p className="form-error">{error}</p>}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••"
            required
          />
        </label>

        <button className="btn btn-gold btn-block" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="small">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
