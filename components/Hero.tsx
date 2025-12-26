import { Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="border-2 border-gray-300 p-6 sm:p-10 lg:p-16 text-center">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-zinc-600 mb-4 sm:mb-6">
            Fullstack Developer
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight text-zinc-900 mb-3 sm:mb-4">
            Building Systems
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight text-zinc-900 mb-6 sm:mb-8">
            That <span className="italic">Scale</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-2">
            Leveraging the latest frameworks and cloud technologies to build maintainable, scalable and reliable full-stack architectures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://github.com/PurityGwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-gray-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors min-h-[44px]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/purity-gwaro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-gray-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors min-h-[44px]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="mailto:puritygwaro99@gmail.com"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white hover:bg-zinc-700 transition-colors min-h-[44px]"
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
