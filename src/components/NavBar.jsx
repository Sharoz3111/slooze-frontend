import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useTheme from "../hooks/useTheme";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className={
        "backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/20 p-4 flex justify-between items-center shadow-sm"
      }
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Slooze Commodities
        </span>

        {user && (
          <>
            {user.role === "manager" && (
              <Link className="hover:underline" to="/dashboard">
                Dashboard
              </Link>
            )}
            <Link className="hover:underline" to="/products">
              Products
            </Link>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded-xl bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/40 transition"
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {user ? (
          <>
            <span className="text-sm opacity-80">{user.email} ({user.role})</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

