
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "@components/LoginPage";
import Dashboard from "@pages/Dashboard";

import ProtectedRoute from "@components/ProtectedRoute";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<AdminLogin />} />
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

