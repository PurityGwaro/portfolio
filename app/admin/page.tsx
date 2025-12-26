'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import BlogForm from '@/components/admin/BlogForm';
import TechStackForm from '@/components/admin/TechStackForm';
import ResumeForm from '@/components/admin/ResumeForm';

export default function AdminPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs' | 'tech' | 'resume'>('projects');

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
      <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="border-2 border-gray-300 p-6 sm:p-8 bg-white">
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-base"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer min-h-[44px]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 bg-white min-h-screen">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-600">
          Manage your portfolio content
        </p>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-8 border-b-2 border-gray-300 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 sm:px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm min-h-[44px] ${
            activeTab === 'projects'
              ? 'bg-white text-zinc-900 border-2 border-gray-300 border-b-0'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-4 sm:px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm min-h-[44px] ${
            activeTab === 'blogs'
              ? 'bg-white text-zinc-900 border-2 border-gray-300 border-b-0'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Blog Posts
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-4 sm:px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm min-h-[44px] ${
            activeTab === 'tech'
              ? 'bg-white text-zinc-900 border-2 border-gray-300 border-b-0'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Tech Stack
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-4 sm:px-6 py-3 font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm min-h-[44px] ${
            activeTab === 'resume'
              ? 'bg-white text-zinc-900 border-2 border-gray-300 border-b-0'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Resume
        </button>
      </div>

      <div>
        {activeTab === 'projects' && <ProjectForm />}
        {activeTab === 'blogs' && <BlogForm />}
        {activeTab === 'tech' && <TechStackForm />}
        {activeTab === 'resume' && <ResumeForm />}
      </div>
    </div>
  );
}
