'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import Toast from '@/components/Toast';

export default function ResumeForm() {
  const [uploading, setUploading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const checkResumeExists = async () => {
    try {
      const response = await fetch('/api/resume/check');
      if (response.ok) {
        const data = await response.json();
        setHasResume(data.exists);
      }
    } catch (error) {
      console.error('Error checking resume:', error);
    }
  };

  useEffect(() => {
    checkResumeExists();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showToast('Resume uploaded successfully!', 'success');
        setHasResume(true);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to upload resume', 'error');
      }
    } catch (error) {
      showToast('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-gray-300 p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Resume
        </h2>
        <p className="text-sm text-zinc-600">
          Upload your resume in PDF format (max 5MB)
        </p>
      </div>

      <div className="space-y-6">
        {hasResume && (
          <div className="flex items-center gap-3 p-4 border-2 border-gray-300 bg-white">
            <FileText className="h-5 w-5 text-zinc-900" />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">
                Current Resume
              </p>
              <p className="text-xs text-zinc-600">
                resume.pdf
              </p>
            </div>
            <a
              href="/api/resume"
              download
              className="text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer"
            >
              Download
            </a>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 p-8 text-center">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="resume-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <Upload className="h-12 w-12 text-zinc-900" />
            <div>
              <p className="text-zinc-900 font-medium mb-1">
                {uploading ? 'Uploading...' : hasResume ? 'Upload New Resume' : 'Upload Resume'}
              </p>
              <p className="text-sm text-zinc-600">
                Click to browse or drag and drop
              </p>
            </div>
          </label>
        </div>

        <div className="text-xs text-zinc-600 space-y-1">
          <p>• Only PDF files are accepted</p>
          <p>• Maximum file size: 5MB</p>
          <p>• {hasResume ? 'Uploading a new resume will replace the existing one' : 'No resume uploaded yet'}</p>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
