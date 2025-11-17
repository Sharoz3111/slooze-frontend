// src/hooks/useTheme.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "slooze_theme";

export default function useTheme() {
  // initialize from localStorage (safely)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch (e) {
      /* ignore */
    }
    return "light";
  });

  // apply to <html> immediately and persist
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.error("Failed to apply theme:", err);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  // expose setTheme too (useful for explicit setting)
  return { theme, toggleTheme, setTheme };
}
