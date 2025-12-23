'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';

interface BlogPost {
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
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
    fetchBlogs();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBlog) {
        // Update existing blog
        const response = await fetch('/api/blogs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldTitle: editingBlog, blog: formData }),
        });

        if (response.ok) {
          showToast('Blog post updated successfully!', 'success');
          setEditingBlog(null);
          setFormData({
            title: '',
            description: '',
            url: '',
          });
          fetchBlogs();
          setIsModalOpen(false);
        } else {
          showToast('Failed to update blog post. Please try again.', 'error');
        }
      } else {
        // Add new blog
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast('Blog post added successfully!', 'success');
          setFormData({
            title: '',
            description: '',
            url: '',
          });
          fetchBlogs();
          setIsModalOpen(false);
        } else {
          showToast('Failed to add blog post. Please try again.', 'error');
        }
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog.title);
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

  const handleDeleteClick = (title: string) => {
    setDeleteConfirm({ isOpen: true, title });
  };

  const handleDeleteConfirm = async () => {
    const title = deleteConfirm.title;
    setDeleteConfirm({ isOpen: false, title: '' });

    try {
      const response = await fetch(`/api/blogs?title=${encodeURIComponent(title)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Blog post deleted successfully!', 'success');
        fetchBlogs();
      } else {
        showToast('Failed to delete blog post. Please try again.', 'error');
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
          Blog Posts ({blogs.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Blog Post
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.title}
              className="border-2 border-zinc-900 dark:border-zinc-100 p-4 flex items-start justify-between gap-4 bg-white dark:bg-black"
            >
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {blog.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {blog.description}
                </p>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {blog.url}
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  title="Edit blog post"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(blog.title)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
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
              <label htmlFor="blog-title" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="blog-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="blog-description" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Short Description *
              </label>
              <textarea
                id="blog-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label htmlFor="blog-url" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Article URL *
              </label>
              <input
                type="url"
                id="blog-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://medium.com/@you/article"
                className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {editingBlog ? 'Update Blog Post' : 'Add Blog Post'}
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