import { ExternalLink, Github } from 'lucide-react';

export interface Project {
  title: string;
  description: string;
  skills: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-8 py-24 bg-white dark:bg-black">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
          Expertise
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Turning complex challenges into simple, scalable solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border-2 border-zinc-900 dark:border-zinc-100 p-8 bg-zinc-50 dark:bg-black flex flex-col"
          >
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-zinc-900 dark:border-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-900 dark:border-zinc-100">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
                >
                  <Github className="h-4 w-4" />
                  View Project
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
                >
                  Live Demo
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
