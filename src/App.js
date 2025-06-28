import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/authPage/LoginPage";
import Dashboard from "./layouts/Dashboard";

import { PrivateRoute } from "./PrivateRoute";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
