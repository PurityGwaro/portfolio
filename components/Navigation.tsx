'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function ResumeLink({ mobile = false }: { mobile?: boolean }) {
  const resumeUrl = useQuery(api.resume.getResumeUrl);

  if (!resumeUrl) return null;

  const className = mobile
    ? "px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer block"
    : "text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer";

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Resume
    </a>
  );
}

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const resumeCheck = useQuery(api.resume.checkResume);
  const hasResume = resumeCheck?.exists ?? false;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-gray-300 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          href="/"
          className="text-sm sm:text-base font-bold text-zinc-900 hover:opacity-70 transition-opacity"
        >
          puritygwaro.dev
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link
            href="/#projects"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Projects
          </Link>
          <Link
            href="/#tech"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Tech
          </Link>
          <Link
            href="/#blog"
            className="text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            Blog
          </Link>
          {hasResume && (
            <ResumeLink />
          )}

          {isAuthenticated && (
            <>
              <Link
                href="/admin"
                className="text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
              >
                Admin
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-zinc-900" />
          ) : (
            <Menu className="h-6 w-6 text-zinc-900" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-gray-300 bg-white">
          <div className="flex flex-col space-y-1 px-4 py-4">
            <Link
              href="/#projects"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Projects
            </Link>
            <Link
              href="/#tech"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Tech
            </Link>
            <Link
              href="/#blog"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Blog
            </Link>
            {hasResume && (
              <div onClick={closeMobileMenu}>
                <ResumeLink mobile />
              </div>
            )}

            {isAuthenticated && (
              <>
                <Link
                  href="/admin"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
