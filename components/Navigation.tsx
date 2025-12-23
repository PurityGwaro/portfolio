'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function Navigation() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
        >
          puritygwaro.dev
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/#projects"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Projects
          </Link>
          <Link
            href="/#tech"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Tech
          </Link>
          <Link
            href="/#blog"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Blog
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/admin"
                className="text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
              >
                Admin
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {mounted && (
            <button
              onClick={toggleTheme}
              className="ml-2 rounded-full p-2 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
