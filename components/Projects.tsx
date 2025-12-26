import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

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
  const displayedProjects = projects.slice(0, 6);
  const hasMoreProjects = projects.length > 6;

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-zinc-900">
          Projects
        </h2>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-600 px-4">
          Turning complex challenges into simple, scalable solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayedProjects.map((project) => (
          <div
            key={project.title}
            className="border-2 border-gray-300 p-6 sm:p-8 flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-600 mb-6 flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-gray-300 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-900"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-row items-center gap-3 pt-4 border-t border-gray-300">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity min-h-[44px]"
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
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity min-h-[44px]"
                >
                  Live Demo
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMoreProjects && (
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/projects"
            className="inline-block border-2 border-gray-300 px-8 py-4 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors min-h-[44px]"
          >
            View All Works
          </Link>
        </div>
      )}
    </section>
  );
}
