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
      <header className='bg-card/80 sticky top-0 z-50 border-b backdrop-blur-md'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center justify-between'>
            <Link href='/dashboard' className='group'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <Image
                    src='/logo.png'
                    alt='AutoFI AI Logo'
                    width={44}
                    height={44}
                    className='transition-transform duration-200 group-hover:scale-105'
                  />
                </div>
                <div>
                  <h1 className='group-hover:text-primary text-xl font-bold tracking-tight transition-colors'>
                    AutoFI AI
                  </h1>
                  <p className='text-muted-foreground text-xs font-medium'>
                    YouTube SEO Optimizer
                  </p>
                </div>
              </div>
            </Link>

            <nav className='flex items-center gap-3'>
              <CtaGithub />
              <ModeToggle />
              <UserNav setShowYouTubeSettings={setShowYouTubeSettings} />
            </nav>
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
