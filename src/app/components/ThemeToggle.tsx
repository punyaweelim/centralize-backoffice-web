// src/app/components/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ป้องกัน hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center space-x-3 p-3 w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span>{isDark ? "โหมดสว่าง" : "โหมดมืด"}</span>
    </button>
  );
}
