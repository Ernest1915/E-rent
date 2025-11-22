import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@store/authStore";

import AdminLogin from "@components/LoginPage";
import Dashboard from "@pages/Dashboard";
import LandingPage from "@pages/LandingPage";

import ProtectedRoute from "@components/ProtectedRoute";
import { Loader2 } from "lucide-react";

export function App() {
  const { fetchUser, user } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.log("App: Starting initialization...");
      try {
        await fetchUser();
        console.log("App: fetchUser completed");
      } catch (e) {
        console.error("App: fetchUser failed", e);
      } finally {
        setIsInitializing(false);
        console.log("App: Initialization done");
      }
    };
    init();
  }, [fetchUser]);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page - Redirects to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <AdminLogin />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}


