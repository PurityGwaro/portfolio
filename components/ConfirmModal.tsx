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
      <div className="relative w-full max-w-md border-2 border-gray-300 bg-white p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 font-medium uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent border-2 border-gray-300 text-zinc-900 py-3 font-medium uppercase tracking-wider hover:bg-zinc-100 transition-colors cursor-pointer text-xs sm:text-sm min-h-[44px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
