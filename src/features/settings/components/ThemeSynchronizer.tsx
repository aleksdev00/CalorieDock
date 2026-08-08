"use client"

import { useEffect } from "react"
import type { Theme } from "../types"

export const THEME_STORAGE_KEY = "caloriedock-theme"

export function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeSynchronizer({ theme }: { theme: Theme }) {
  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => applyTheme("system")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])
  return null
}
