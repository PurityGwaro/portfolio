'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface BlogPost {
  _id: Id<"blogs">;
  title: string;
  description: string;
  url: string;
}

export default function BlogForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
  });
  const [editingBlog, setEditingBlog] = useState<{id: Id<"blogs">; title: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: Id<"blogs"> | null; title: string }>({
    isOpen: false,
    id: null,
    title: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const blogs = useQuery(api.blogs.list) ?? [];
  const createBlog = useMutation(api.blogs.create);
  const updateBlog = useMutation(api.blogs.update);
  const removeBlog = useMutation(api.blogs.remove);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBlog) {
        // Update existing blog
        await updateBlog({
          id: editingBlog.id,
          title: formData.title,
          description: formData.description,
          url: formData.url,
        });
        showToast('Blog post updated successfully!', 'success');
        setEditingBlog(null);
        setFormData({
          title: '',
          description: '',
          url: '',
        });
        setIsModalOpen(false);
      } else {
        // Add new blog
        await createBlog({
          title: formData.title,
          description: formData.description,
          url: formData.url,
        });
        showToast('Blog post added successfully!', 'success');
        setFormData({
          title: '',
          description: '',
          url: '',
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({id: blog._id, title: blog.title});
    setFormData({
      title: blog.title,
      description: blog.description,
      url: blog.url,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      description: '',
      url: '',
    });
  };

  const handleDeleteClick = (id: Id<"blogs">, title: string) => {
    setDeleteConfirm({ isOpen: true, id, title });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ isOpen: false, id: null, title: '' });

    if (!id) return;

    try {
      await removeBlog({ id });
      showToast('Blog post deleted successfully!', 'success');
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
          Blog Posts ({blogs.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          Add Blog Post
        </button>
      </div>

      {blogs === undefined ? (
        <p className="text-zinc-600">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-zinc-600">No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog: BlogPost) => (
            <div
              key={blog._id}
              className="border-2 border-gray-300 p-4 flex flex-col sm:flex-row items-start justify-between gap-4 bg-white"
            >
              <div className="flex-1 w-full sm:w-auto">
                <h4 className="font-bold text-zinc-900 mb-1">
                  {blog.title}
                </h4>
                <p className="text-sm text-zinc-600 mb-2">
                  {blog.description}
                </p>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline cursor-pointer break-all"
                >
                  {blog.url}
                </a>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Edit blog post"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(blog._id, blog.title)}
                  className="p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Delete blog post"
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
        title={editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="blog-title" className="block text-sm font-medium text-zinc-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="blog-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label htmlFor="blog-description" className="block text-sm font-medium text-zinc-900 mb-2">
                Short Description *
              </label>
              <textarea
                id="blog-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label htmlFor="blog-url" className="block text-sm font-medium text-zinc-900 mb-2">
                Article URL *
              </label>
              <input
                type="url"
                id="blog-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://medium.com/@you/article"
                className="w-full border-2 border-gray-300 bg-white text-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 text-white py-3 font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
            >
              {editingBlog ? 'Update Blog Post' : 'Add Blog Post'}
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
        title="Delete Blog Post"
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