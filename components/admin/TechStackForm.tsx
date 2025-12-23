'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface Tech {
  name: string;
  category: string;
}

export default function TechStackForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });
  const [techStack, setTechStack] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTech, setEditingTech] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; name: string }>({
    isOpen: false,
    name: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    fetchTechStack();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const fetchTechStack = async () => {
    try {
      const response = await fetch('/api/techstack');
      if (response.ok) {
        const data = await response.json();
        setTechStack(data);
      }
    } catch (error) {
      console.error('Error fetching tech stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTech) {
        // Update existing tech
        const response = await fetch('/api/techstack', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldName: editingTech, tech: formData }),
        });

        if (response.ok) {
          showToast('Technology updated successfully!', 'success');
          setEditingTech(null);
          setFormData({
            name: '',
            category: '',
          });
          fetchTechStack();
          setIsModalOpen(false);
        } else {
          showToast('Failed to update technology. Please try again.', 'error');
        }
      } else {
        // Add new tech
        const response = await fetch('/api/techstack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast('Technology added successfully!', 'success');
          setFormData({
            name: '',
            category: '',
          });
          fetchTechStack();
          setIsModalOpen(false);
        } else {
          showToast('Failed to add technology. Please try again.', 'error');
        }
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (tech: Tech) => {
    setEditingTech(tech.name);
    setFormData({
      name: tech.name,
      category: tech.category,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTech(null);
    setFormData({
      name: '',
      category: '',
    });
  };

  const handleDeleteClick = (name: string) => {
    setDeleteConfirm({ isOpen: true, name });
  };

  const handleDeleteConfirm = async () => {
    const name = deleteConfirm.name;
    setDeleteConfirm({ isOpen: false, name: '' });

    try {
      const response = await fetch(`/api/techstack?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Technology deleted successfully!', 'success');
        fetchTechStack();
      } else {
        showToast('Failed to delete technology. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, name: '' });
  };

  // Group tech by category for display
  const groupedTech = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Tech[]>);

  return (
    <div className="border-2 border-gray-300 dark:border-gray-700 p-8 bg-white dark:bg-black">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Technologies ({techStack.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Technology
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : techStack.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No technologies yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTech).map(([category, techs]) => (
            <div key={category}>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                {category}
              </h4>
              <div className="space-y-2">
                {techs.map((tech) => (
                  <div
                    key={tech.name}
                    className="border-2 border-gray-300 dark:border-gray-700 p-3 flex items-center justify-between gap-4 bg-white dark:bg-black"
                  >
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {tech.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tech)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                        title="Edit technology"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tech.name)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        title="Delete technology"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTech ? 'Edit Technology' : 'Add New Technology'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="tech-name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Technology Name *
              </label>
              <input
                type="text"
                id="tech-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="tech-category" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="tech-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Core Backend, Databases & ORM, Infrastructure & DevOps"
                className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {editingTech ? 'Update Technology' : 'Add Technology'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-zinc-900 dark:text-zinc-100 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
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
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
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