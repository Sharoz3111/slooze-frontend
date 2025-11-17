import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role NOT allowed → deny access
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        ❌ Unauthorized — You do not have access to this page.
      </div>
    );
  }

  // Otherwise allow page to load
  return children;
}
