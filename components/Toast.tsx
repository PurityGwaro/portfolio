'use client';

import { useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 min-w-[300px] border-2 p-4 shadow-lg ${
          type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-500'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0" />
        )}
        <p
          className={`flex-1 font-medium ${
            type === 'success'
              ? 'text-green-900 dark:text-green-100'
              : 'text-red-900 dark:text-red-100'
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer ${
            type === 'success'
              ? 'text-green-900 dark:text-green-100'
              : 'text-red-900 dark:text-red-100'
          }`}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
