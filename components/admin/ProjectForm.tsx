'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface Project {
  _id: Id<"projects">;
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
  const [editingProject, setEditingProject] = useState<{id: Id<"projects">; title: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: Id<"projects"> | null; title: string }>({
    isOpen: false,
    id: null,
    title: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const projects = useQuery(api.projects.list) ?? [];
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const removeProject = useMutation(api.projects.remove);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    const projectData = {
      title: formData.title,
      description: formData.description,
      skills: skillsArray,
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
    };

    try {
      if (editingProject) {
        // Update existing project
        await updateProject({
          id: editingProject.id,
          ...projectData,
        });
        showToast('Project updated successfully!', 'success');
        setEditingProject(null);
        setFormData({
          title: '',
          description: '',
          skills: '',
          githubUrl: '',
          liveUrl: '',
        });
        setIsModalOpen(false);
      } else {
        // Add new project
        await createProject(projectData);
        showToast('Project added successfully!', 'success');
        setFormData({
          title: '',
          description: '',
          skills: '',
          githubUrl: '',
          liveUrl: '',
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject({id: project._id, title: project.title});
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

  const handleDeleteClick = (id: Id<"projects">, title: string) => {
    setDeleteConfirm({ isOpen: true, id, title });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ isOpen: false, id: null, title: '' });

    if (!id) return;

    try {
      await removeProject({ id });
      showToast('Project deleted successfully!', 'success');
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null, title: '' });
  };

  return (
    <div className="border-2 border-gray-300 p-4 sm:p-6 lg:p-8 bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {projects === undefined ? (
        <p className="text-zinc-600">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-zinc-600">No projects yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project: Project) => (
            <div
              key={project._id}
              className="border-2 border-gray-300 p-4 flex flex-col sm:flex-row items-start justify-between gap-4 bg-white"
            >
              <div className="flex-1 w-full sm:w-auto">
                <h4 className="font-bold text-zinc-900 mb-1">
                  {project.title}
                </h4>
                <p className="text-sm text-zinc-600 mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="text-xs border border-gray-300 px-2 py-1 text-zinc-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Edit project"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(project._id, project.title)}
                  className="p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              <label htmlFor="title" className="block text-sm font-medium text-zinc-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-zinc-900 mb-2">
                Skills (comma-separated) *
              </label>
              <input
                type="text"
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="TypeScript, Node.js, React"
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-zinc-900 mb-2">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-zinc-900 mb-2">
                Live URL (optional)
              </label>
              <input
                type="url"
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 text-white py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="sm:px-6 bg-transparent border-2 border-gray-300 text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
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
