import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold">Create your account</h1>
      <p className="text-ink/60 mt-2">Join as a student or an instructor.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-rust bg-rust/10 border border-rust/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-rule bg-white"
          />
        </div>
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
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-rule bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium">I am joining as</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {["student", "instructor"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  form.role === r
                    ? "bg-ink text-paper border-ink"
                    : "border-rule hover:border-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-marigold font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
