import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import mark from "../assets/mark.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Mark is dark-on-navy, so it always sits on its own navy chip for guaranteed contrast */}
          <span className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
            <img src={mark} alt="" className="w-full h-full object-contain" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Nursita
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link to="/courses" className="hover:text-marigold transition-colors">
            Courses
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-marigold transition-colors">
              Dashboard
            </Link>
          )}
          {user?.role === "instructor" && (
            <Link to="/instructor" className="hover:text-marigold transition-colors">
              Teach
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-ink/60">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-rule hover:border-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-ink text-paper hover:bg-marigold hover:text-ink transition-colors"
              >
                Start learning
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
