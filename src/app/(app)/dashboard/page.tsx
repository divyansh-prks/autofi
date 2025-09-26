'use client';

import { useState } from 'react';
import UploadSection from '@/components/dashboard/upload-section';
import VideosSection from '@/components/dashboard/videos-section';

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVideoAdded = () => {
    // Trigger refresh of videos section
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className='from-background via-background to-muted/20 min-h-screen bg-gradient-to-br'>
      <div className='container mx-auto max-w-7xl space-y-12 px-4 py-8'>
        {/* Upload Section - Hero area with upload functionality */}
        <section className='relative'>
          <UploadSection onVideoAdded={handleVideoAdded} />
        </section>

        {/* Videos Section - Grid of user videos */}
        <section className='relative'>
          <VideosSection refreshTrigger={refreshTrigger} />
        </section>
      </div>
    </div>
  );
}
