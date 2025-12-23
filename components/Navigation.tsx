'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const checkResume = async () => {
      try {
        const response = await fetch('/api/resume/check');
        if (response.ok) {
          const data = await response.json();
          setHasResume(data.exists);
        }
      } catch (error) {
        console.error('Error checking resume existence:', error);
        setHasResume(false);
      }
    };
    checkResume();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
        >
          puritygwaro.dev
        </Link>

        <div className="flex items-center gap-8" suppressHydrationWarning>
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
          {hasResume && (
            <a
              href="/api/resume"
              download
              className="text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity cursor-pointer"
            >
              Resume
            </a>
          )}

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

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
