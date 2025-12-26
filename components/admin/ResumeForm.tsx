'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FileText, AlertCircle, Upload } from 'lucide-react';

export default function ResumeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resumeCheck = useQuery(api.resume.checkResume);
  const hasResume = resumeCheck?.exists ?? false;
  const resumeUrl = useQuery(api.resume.getResumeUrl);
  const generateUploadUrl = useMutation(api.resume.generateUploadUrl);
  const saveResumeId = useMutation(api.resume.saveResumeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Please select a PDF file' });
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      // Step 1: Get a short-lived upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: POST the file to the upload URL
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = await result.json() as { storageId: Id<"_storage"> };

      // Step 3: Save the storage ID to the database
      await saveResumeId({ storageId });

      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-gray-300 p-4 sm:p-6 lg:p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
          Resume
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Upload and manage your resume (PDF only, max 5MB)
        </p>
      </div>

      <div className="space-y-6">
        {hasResume && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-2 border-gray-300 bg-white">
            <FileText className="h-5 w-5 text-zinc-900 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">
                Current Resume
              </p>
              <p className="text-xs text-zinc-600">
                resume.pdf
              </p>
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                download
                className="w-full sm:w-auto text-center sm:text-left text-sm font-medium uppercase tracking-wider text-zinc-900 hover:opacity-70 transition-opacity cursor-pointer min-h-[44px] flex items-center justify-center sm:justify-start"
              >
                Download
              </a>
            )}
          </div>
        )}

        <div className="border-2 border-gray-300 bg-zinc-50 p-4 sm:p-6">
          <h3 className="text-sm font-bold text-zinc-900 mb-4">
            Upload New Resume
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="resume-upload"
                className="flex flex-col sm:flex-row items-center justify-center gap-2 p-4 sm:p-6 border-2 border-dashed border-gray-300 bg-white cursor-pointer hover:bg-zinc-50 transition-colors min-h-[44px]"
              >
                <Upload className="h-5 w-5 text-zinc-600" />
                <span className="text-xs sm:text-sm text-zinc-600 text-center sm:text-left break-all px-2">
                  {file ? file.name : 'Choose PDF file'}
                </span>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {message && (
              <div className={`p-3 border-2 ${
                message.type === 'success'
                  ? 'border-green-300 bg-green-50 text-green-900'
                  : 'border-red-300 bg-red-50 text-red-900'
              }`}>
                <p className="text-xs sm:text-sm">{message.text}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full px-6 py-3 bg-zinc-900 text-white text-xs sm:text-sm font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {!hasResume && (
          <div className="flex items-start gap-3 p-4 border-2 border-gray-300 bg-zinc-50">
            <AlertCircle className="h-5 w-5 text-zinc-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-900 mb-1">
                No Resume Found
              </p>
              <p className="text-xs text-zinc-600">
                Upload your first resume using the form above.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
