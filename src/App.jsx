import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import useTheme from "./hooks/useTheme";

function AppContent() {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Helper redirect component used as default route
  function RootRedirect() {
    if (!user) return <Navigate to="/login" replace />;
    return user.role === "manager" ? <Navigate to="/dashboard" replace /> : <Navigate to="/products" replace />;
  }

  return (
    <div
  className={
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen"
      : "bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 text-gray-900 min-h-screen"
  }
>

      {/* Show NavBar only if logged in */}
      {user && <NavBar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["manager", "storekeeper"]}>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* Default route -> smart redirect */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
