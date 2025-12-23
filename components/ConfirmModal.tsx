'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message }: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onCancel}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-md border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-black p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          {message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 dark:bg-red-600 text-white py-3 font-medium uppercase tracking-wider hover:bg-red-700 dark:hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white dark:bg-black border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
