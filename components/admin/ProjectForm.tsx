'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface Project {
  title: string;
  description: string;
  skills: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; title: string }>({
    isOpen: false,
    title: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    const project = {
      title: formData.title,
      description: formData.description,
      skills: skillsArray,
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
    };

    try {
      if (editingProject) {
        // Update existing project
        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldTitle: editingProject, project }),
        });

        if (response.ok) {
          showToast('Project updated successfully!', 'success');
          setEditingProject(null);
          setFormData({
            title: '',
            description: '',
            skills: '',
            githubUrl: '',
            liveUrl: '',
          });
          fetchProjects();
          setIsModalOpen(false);
        } else {
          showToast('Failed to update project. Please try again.', 'error');
        }
      } else {
        // Add new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project),
        });

        if (response.ok) {
          showToast('Project added successfully!', 'success');
          setFormData({
            title: '',
            description: '',
            skills: '',
            githubUrl: '',
            liveUrl: '',
          });
          fetchProjects();
          setIsModalOpen(false);
        } else {
          showToast('Failed to add project. Please try again.', 'error');
        }
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project.title);
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      skills: '',
      githubUrl: '',
      liveUrl: '',
    });
  };

  const handleDeleteClick = (title: string) => {
    setDeleteConfirm({ isOpen: true, title });
  };

  const handleDeleteConfirm = async () => {
    const title = deleteConfirm.title;
    setDeleteConfirm({ isOpen: false, title: '' });

    try {
      const response = await fetch(`/api/projects?title=${encodeURIComponent(title)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Project deleted successfully!', 'success');
        fetchProjects();
      } else {
        showToast('Failed to delete project. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, title: '' });
  };

  return (
    <div className="border-2 border-zinc-900 dark:border-zinc-100 p-8 bg-white dark:bg-black">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No projects yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.title}
              className="border-2 border-zinc-900 dark:border-zinc-100 p-4 flex items-start justify-between gap-4 bg-white dark:bg-black"
            >
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {project.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs border border-zinc-900 dark:border-zinc-100 px-2 py-1 text-zinc-900 dark:text-zinc-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  title="Edit project"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(project.title)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Skills (comma-separated) *
              </label>
              <input
                type="text"
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="TypeScript, Node.js, React"
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Live URL (optional)
              </label>
              <input
                type="url"
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 bg-transparent border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
