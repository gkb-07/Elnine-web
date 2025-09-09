"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md grid place-items-center border surface shadow-soft"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? (
        <span className="text-sm">☀️</span>
      ) : (
        <span className="text-sm">🌙</span>
      )}
    </button>
  );
}


