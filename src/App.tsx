import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm";
import SignupForm from "./components/signup"
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
