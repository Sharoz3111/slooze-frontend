import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("slooze_session")) || null;
    } catch {
      return null;
    }
  });

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem("slooze_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("slooze_session");
    }
  }, [user]);

  // Simulated POST /auth/login
  async function login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // pretend network delay
    await new Promise((res) => setTimeout(res, 300));

    // Assign role based on email (demo rule)
    let role = "storekeeper";
    if (email.toLowerCase().includes("manager")) role = "manager";
    if (email.toLowerCase().includes("store")) role = "storekeeper";

    const session = {
      email,
      role,
      token: "mock-token-" + Math.random().toString(36).slice(2),
    };

    setUser(session);
    return session;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
