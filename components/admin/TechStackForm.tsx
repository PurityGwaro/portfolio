'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface Tech {
  _id: Id<"techstack">;
  name: string;
  category: string;
}

export default function TechStackForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    newCategory: '',
  });
  const [editingTech, setEditingTech] = useState<{id: Id<"techstack">; name: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ old: string; new: string }>({ old: '', new: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: Id<"techstack"> | null; name: string }>({
    isOpen: false,
    id: null,
    name: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const techStack = useQuery(api.techstack.list) ?? [];
  const createTech = useMutation(api.techstack.create);
  const updateTech = useMutation(api.techstack.update);
  const removeTech = useMutation(api.techstack.remove);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
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
        await updateTech({
          id: editingTech.id,
          ...techData,
        });
        showToast('Technology updated successfully!', 'success');
        setEditingTech(null);
        setFormData({
          name: '',
          category: '',
          newCategory: '',
        });
        setUseCustomCategory(false);
        setIsModalOpen(false);
      } else {
        await createTech(techData);
        showToast('Technology added successfully!', 'success');
        setFormData({
          name: '',
          category: '',
          newCategory: '',
        });
        setUseCustomCategory(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (tech: Tech) => {
    setEditingTech({id: tech._id, name: tech.name});
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

  const handleDeleteClick = (id: Id<"techstack">, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ isOpen: false, id: null, name: '' });

    if (!id) return;

    try {
      await removeTech({ id });
      showToast('Technology deleted successfully!', 'success');
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null, name: '' });
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
      const techsToUpdate = techStack.filter((t: Tech) => t.category === editingCategory.old);

      for (const tech of techsToUpdate) {
        await updateTech({
          id: tech._id,
          name: tech.name,
          category: editingCategory.new
        });
      }

      showToast('Category updated successfully!', 'success');
      setIsCategoryModalOpen(false);
      setEditingCategory({ old: '', new: '' });
    } catch (error) {
      showToast('Error updating category: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  // Group tech by category for display
  const groupedTech = techStack.reduce((acc: Record<string, Tech[]>, tech: Tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Tech[]>);

  // Get unique categories for dropdown
  const categories = Array.from(new Set(techStack.map((t: Tech) => t.category))).sort() as string[];

  return (
    <div className="border-2 border-gray-300 p-8 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">
          Technologies ({techStack.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Technology
        </button>
      </div>

      {techStack === undefined ? (
        <p className="text-zinc-600">Loading...</p>
      ) : techStack.length === 0 ? (
        <p className="text-zinc-600">No technologies yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTech).map(([category, techs]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-zinc-900">
                  {category}
                </h4>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Edit category name"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {(techs as Tech[]).map((tech: Tech) => (
                  <div
                    key={tech._id}
                    className="border-2 border-gray-300 p-3 flex items-center justify-between gap-4 bg-white"
                  >
                    <span className="text-zinc-900">
                      {tech.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tech)}
                        className="p-2 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit technology"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tech._id, tech.name)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
              <label htmlFor="tech-name" className="block text-sm font-medium text-zinc-900 mb-2">
                Technology Name *
              </label>
              <input
                type="text"
                id="tech-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Category *
              </label>

              {!useCustomCategory && categories.length > 0 ? (
                <>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required={!useCustomCategory}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: string) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomCategory(true)}
                    className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 underline"
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
                    className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required={useCustomCategory}
                  />
                  {categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomCategory(false);
                        setFormData({ ...formData, newCategory: '' });
                      }}
                      className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 underline"
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
              className="flex-1 bg-zinc-900 text-white py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {editingTech ? 'Update Technology' : 'Add Technology'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 bg-transparent border-2 border-gray-300 text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 transition-colors cursor-pointer"
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
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={editingCategory.new}
              onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
              className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <p className="mt-2 text-sm text-zinc-600">
              This will update the category for all technologies in &ldquo;{editingCategory.old}&rdquo;
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCategoryUpdate}
              className="flex-1 bg-zinc-900 text-white py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Update Category
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-6 bg-transparent border-2 border-gray-300 text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 transition-colors cursor-pointer"
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
