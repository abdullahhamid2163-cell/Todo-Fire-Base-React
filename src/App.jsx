import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./modules/auth/Login";
import SignUp from "./modules/auth/SignUp";
import Dashboard from "./modules/home/dashboard";
import { AuthProvider } from "./modules/firebase/AuthContext";
import ProtectedRoute from "./modules/firebase/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
