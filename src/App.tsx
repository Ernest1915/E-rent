import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "@components/signup";
import LoginForm from "@components/loginForm";
import Dashboard from "@pages/Dashboard";
import { useAuthStore } from "@store/authStore";
import ProtectedRoute from "@components/ProtectedRoute";

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

export default App;

