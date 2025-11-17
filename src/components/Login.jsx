import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to correct page immediately
  useEffect(() => {
    if (user) {
      if (user.role === "manager") navigate("/dashboard", { replace: true });
      else navigate("/products", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await login({ email, password });

      if (session.role === "manager") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
          : "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      }
    >
      <div
        className={
          theme === "dark"
            ? "bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-700 w-full max-w-md"
            : "bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
        }
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-200 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. manager@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small className="text-gray-500">
              Use <b>manager</b> or <b>store</b> in email to select role
            </small>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg text-lg hover:bg-indigo-700 transition-all"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
