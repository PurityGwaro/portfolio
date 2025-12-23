'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import BlogForm from '@/components/admin/BlogForm';
import TechStackForm from '@/components/admin/TechStackForm';

export default function AdminPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs' | 'tech'>('projects');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
      router.refresh();
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="border-2 border-zinc-900 dark:border-zinc-100 p-8 bg-white dark:bg-black">
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 bg-zinc-50 dark:bg-black min-h-screen">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your portfolio content
        </p>
      </div>

      <div className="flex gap-4 mb-8 border-b-2 border-zinc-900 dark:border-zinc-100">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'blogs'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          Blog Posts
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'tech'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          Tech Stack
        </button>
      </div>

      <div>
        {activeTab === 'projects' && <ProjectForm />}
        {activeTab === 'blogs' && <BlogForm />}
        {activeTab === 'tech' && <TechStackForm />}
      </div>
    </div>
  );
}
