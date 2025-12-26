'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

export default function ResumePage() {
  const router = useRouter();
  const resumeUrl = useQuery(api.resume.getResumeUrl);

  if (resumeUrl === null) {
    // No resume found
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Resume Not Found</h1>
          <p className="text-zinc-600 mb-6">No resume has been uploaded yet.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-zinc-900 text-white font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!resumeUrl) {
    // Still loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-zinc-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header with download button */}
      <div className="bg-white border-b-2 border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Resume</h1>
          <a
            href={resumeUrl}
            download="Purity_Gwaro_Resume.pdf"
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-zinc-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-zinc-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white border-2 border-gray-300 shadow-lg">
          <iframe
            src={resumeUrl}
            className="w-full h-[calc(100vh-120px)] min-h-[600px]"
            title="Resume PDF"
          />
        </div>
      </div>
    </div>
  );
}
