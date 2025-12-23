import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-5xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
            Get in Touch
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Reach out for opportunities, collaborations, or just to talk backend.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://github.com/puritygwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/puritygwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="mailto:puritygwaro99@gmail.com"
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black py-6">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} puritygwaro.dev • All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
