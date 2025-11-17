import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    fetchUser(); // Load current user from Appwrite
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
