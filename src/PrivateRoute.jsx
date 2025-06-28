import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  console.log("Giá trị token:", token);
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
