"use client";

import { useSyncExternalStore } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    mql.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");

    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {isDark ? (
        <SunIcon className="w-4 h-4 text-amber-400" />
      ) : (
        <MoonIcon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );
}
