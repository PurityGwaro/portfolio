import { Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-32 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="border-2 border-gray-300 dark:border-gray-700 p-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
            Fullstack Developer
          </p>
          <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            Building Systems
          </h1>
          <h2 className="text-6xl md:text-7xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
            That <span className="italic">Scale</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-12">
            Leveraging the latest frameworks and cloud technologies to build maintainable, scalable and reliable full-stack architectures.
          </p>

          <div className="flex items-center justify-center gap-4">
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
    </section>
  );
}
