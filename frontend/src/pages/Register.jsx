import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Create your account</h1>

      <form className="form" onSubmit={onSubmit} noValidate>
        {error && <p className="form-error">{error}</p>}

        <label className="field">
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Ada Lovelace"
            required
          />
        </label>

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
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>

        <button className="btn btn-gold btn-block" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="small">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
