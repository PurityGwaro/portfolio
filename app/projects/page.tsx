'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/components/Projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-zinc-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-24 min-h-screen bg-white">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold uppercase tracking-tight text-zinc-900">
          All Projects
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          A comprehensive showcase of my work and expertise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border-2 border-gray-300 p-8 flex flex-col bg-white hover:border-zinc-600 transition-colors"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-3">
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
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity"
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
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity"
                >
                  Live Demo
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-600">No projects found.</p>
        </div>
      )}
    </section>
  );
}
