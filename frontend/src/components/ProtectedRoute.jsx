import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// roles: optional array e.g. ["instructor", "admin"]. Omit to just require login.
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-rule">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
