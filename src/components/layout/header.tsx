'use client';

import React, { useState } from 'react';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';
import Image from 'next/image';
import { SettingsDialog } from '../settings-dialog';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { Eye, TrendingUp, Users } from 'lucide-react';

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
              <Card className='bg-card/50 border-border/50 p-0'>
                <CardContent className='p-3'>
                  <div className='flex items-center gap-2'>
                    <Users className='text-primary h-4 w-4' />
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Subscribers
                      </p>
                      <p className='text-sm font-semibold'>100k</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card/50 border-border/50 p-0'>
                <CardContent className='p-3'>
                  <div className='flex items-center gap-2'>
                    <Eye className='text-primary h-4 w-4' />
                    <div>
                      <p className='text-muted-foreground text-xs'>Avg Views</p>
                      <p className='text-sm font-semibold'>200M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card/50 border-border/50 p-0'>
                <CardContent className='p-3'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='text-primary h-4 w-4' />
                    <div>
                      <p className='text-muted-foreground text-xs'>
                        Engagement
                      </p>
                      <p className='text-sm font-semibold'>5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
