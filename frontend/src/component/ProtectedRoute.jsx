import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading state while AuthContext checks local storage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-ink/60 font-medium animate-pulse">Loading securely...</div>
      </div>
    );
  }

  // If no user is found, redirect to the login page immediately
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a user exists, render the protected component or child routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;