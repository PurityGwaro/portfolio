'use client';

import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-gray-300 bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-5xl font-bold uppercase tracking-tight text-zinc-900">
            Get in Touch
          </h2>
          <p className="text-lg text-zinc-600">
            Reach out for opportunities, collaborations, or just to talk backend.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://github.com/PurityGwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-gray-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/purity-gwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-gray-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="mailto:puritygwaro99@gmail.com"
              className="flex items-center gap-2 bg-zinc-900 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white hover:bg-zinc-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 bg-white py-6">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} puritygwaro.dev • All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
