import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@store/authStore";

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  // While checking session
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not logged in, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show requested route
  return <Outlet />;
};

export default ProtectedRoute;
