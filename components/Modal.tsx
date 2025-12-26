'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto border-0 sm:border-2 border-gray-300 bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white pb-4 border-b sm:border-0 border-gray-300">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 pr-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 transition-colors cursor-pointer flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-zinc-900" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
