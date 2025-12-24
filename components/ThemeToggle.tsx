'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SunIcon } from './SunIcon'
import { MoonIcon } from './MoonIcon'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, systemTheme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="ml-2 rounded-full p-2 w-8 h-8" />
    )
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const handleTheme = () => {
    console.log('Current theme:', currentTheme, 'Setting to:', currentTheme === "light" ? "dark" : "light");
    if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={handleTheme}
      className="ml-2 rounded-full p-2 text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  )
}
