import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      <p className="text-ink/60 mt-2">Log in to continue where you left off.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-rust bg-rust/10 border border-rust/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-rule bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-rule bg-white"
          />
        </div>
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New to Nursita?{" "}
        <Link to="/register" className="text-marigold font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
