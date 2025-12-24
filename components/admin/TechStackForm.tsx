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
    newCategory: '',
  });
  const [techStack, setTechStack] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTech, setEditingTech] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ old: string; new: string }>({ old: '', new: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; name: string }>({
    isOpen: false,
    name: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });
  const [useCustomCategory, setUseCustomCategory] = useState(false);

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

    const finalCategory = useCustomCategory ? formData.newCategory : formData.category;

    if (!finalCategory) {
      showToast('Please select or enter a category', 'error');
      return;
    }

    const techData = {
      name: formData.name,
      category: finalCategory,
    };

    try {
      if (editingTech) {
        const response = await fetch('/api/techstack', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldName: editingTech, tech: techData }),
        });

        if (response.ok) {
          showToast('Technology updated successfully!', 'success');
          setEditingTech(null);
          setFormData({
            name: '',
            category: '',
            newCategory: '',
          });
          setUseCustomCategory(false);
          fetchTechStack();
          setIsModalOpen(false);
        } else {
          showToast('Failed to update technology. Please try again.', 'error');
        }
      } else {
        const response = await fetch('/api/techstack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(techData),
        });

        if (response.ok) {
          showToast('Technology added successfully!', 'success');
          setFormData({
            name: '',
            category: '',
            newCategory: '',
          });
          setUseCustomCategory(false);
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
      newCategory: '',
    });
    setUseCustomCategory(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTech(null);
    setFormData({
      name: '',
      category: '',
      newCategory: '',
    });
    setUseCustomCategory(false);
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

  const handleEditCategory = (category: string) => {
    setEditingCategory({ old: category, new: category });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryUpdate = async () => {
    if (!editingCategory.new || editingCategory.new === editingCategory.old) {
      setIsCategoryModalOpen(false);
      return;
    }

    try {
      // Update all technologies with the old category to the new category
      const techsToUpdate = techStack.filter(t => t.category === editingCategory.old);

      for (const tech of techsToUpdate) {
        await fetch('/api/techstack', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldName: tech.name,
            tech: { name: tech.name, category: editingCategory.new }
          }),
        });
      }

      showToast('Category updated successfully!', 'success');
      setIsCategoryModalOpen(false);
      setEditingCategory({ old: '', new: '' });
      fetchTechStack();
    } catch (error) {
      showToast('Error updating category: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  // Group tech by category for display
  const groupedTech = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Tech[]>);

  // Get unique categories for dropdown
  const categories = Array.from(new Set(techStack.map(t => t.category))).sort();

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
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {category}
                </h4>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                  title="Edit category name"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
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
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Category *
              </label>

              {!useCustomCategory && categories.length > 0 ? (
                <>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    required={!useCustomCategory}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomCategory(true)}
                    className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
                  >
                    + Create new category
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.newCategory}
                    onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                    placeholder="e.g., Core Backend, Databases & ORM"
                    className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    required={useCustomCategory}
                  />
                  {categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomCategory(false);
                        setFormData({ ...formData, newCategory: '' });
                      }}
                      className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
                    >
                      Choose from existing categories
                    </button>
                  )}
                </>
              )}
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

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Edit Category Name"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={editingCategory.new}
              onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
              className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              This will update the category for all technologies in &ldquo;{editingCategory.old}&rdquo;
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCategoryUpdate}
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Update Category
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-6 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-zinc-900 dark:text-zinc-100 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
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
