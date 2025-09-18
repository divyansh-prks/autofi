'use client';
import { useState } from 'react';

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/process', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };
  console.log(result?.metadata?.fallback);
  return (
    <div className='mx-auto mt-6 max-w-xl rounded-lg border p-6 shadow'>
      <input
        type='file'
        accept='video/*'
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className='mb-4'
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className='rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50'
      >
        {loading ? 'Processing...' : 'Upload & Generate Metadata'}
      </button>

      {result && (
        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='rounded-lg border p-4'>
            <h3 className='mb-2 font-semibold'>Transcript</h3>
            <div className='max-h-[420px] overflow-auto rounded bg-gray-50 p-3 text-sm text-gray-800'>
              {result.transcript}
            </div>
          </div>

          <div className='overflow-auto rounded-lg border p-4 md:sticky md:top-4 md:h-fit'>
            <h3 className='mb-2 font-semibold'>Generated Metadata</h3>
            {result?.metadata?.fallback ? (
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-blue-600'>Title</h4>
                  <p className='text-sm'>{result.metadata.fallback.title}</p>
                </div>
                <div>
                  <h4 className='font-medium text-blue-600'>Description</h4>
                  <p className='text-sm whitespace-pre-wrap'>
                    {result.metadata.fallback.description}
                  </p>
                </div>
                <div>
                  <h4 className='font-medium text-blue-600'>Tags</h4>
                  <div className='flex flex-wrap gap-2'>
                    {result.metadata.fallback.tags.map(
                      (tag: string, idx: number) => (
                        <span
                          key={idx}
                          className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
                {result.metadata.fallback.chapters &&
                  result.metadata.fallback.chapters.length > 0 && (
                    <div>
                      <h4 className='font-medium text-blue-600'>Chapters</h4>
                      <ul className='list-inside list-disc text-sm'>
                        {result.metadata.fallback.chapters.map(
                          (chapter: string, index: number) => (
                            <li key={index}>{chapter}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                <div className='text-xs text-gray-500'>
                  {result.metadata.raw}
                </div>
              </div>
            ) : (
              <pre className='rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap'>
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
