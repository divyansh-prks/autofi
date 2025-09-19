'use client';

import React, { useState } from 'react';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';
import Image from 'next/image';
import { SettingsDialog } from '../settings-dialog';
import Link from 'next/link';

export default function Header() {
  const [showYouTubeSettings, setShowYouTubeSettings] = useState(false);

  return (
    <>
      <header className='bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm'>
        <div className='container mx-auto p-2'>
          <div className='flex items-center justify-between'>
            <Link href='/dashboard'>
              <div className='flex items-center gap-2'>
                <Image src='/logo.png' alt='logo' width={50} height={50} />
                <div>
                  <h1 className='text-lg font-extrabold text-balance'>
                    AutoFI AI
                  </h1>
                  <p className='text-muted-foreground text-xs'>
                    YouTube SEO Optimizer
                  </p>
                </div>
              </div>
            </Link>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <CtaGithub />
                <ModeToggle />
                <UserNav setShowYouTubeSettings={setShowYouTubeSettings} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <SettingsDialog
        open={showYouTubeSettings}
        onOpenChange={setShowYouTubeSettings}
      />
    </>
  );
}
