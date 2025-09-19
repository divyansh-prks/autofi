'use client';

import { Button } from '@/components/ui/button';
import { Youtube, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface NavigationProps {
  userId?: string | null;
}

const Navigation = ({ userId }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='glass border-border/50 fixed top-0 right-0 left-0 z-50 border-b'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/dashboard'>
            <div className='flex items-center gap-2'>
              <img src='/logo.png' alt='logo' width={50} height={50} />
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

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            <a
              href='#features'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Features
            </a>
            <a
              href='#dashboard'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Dashboard
            </a>
            <a
              href='#pricing'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Pricing
            </a>
            <a
              href='#docs'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Docs
            </a>
          </div>

          {/* CTA Buttons */}
          <div className='hidden items-center gap-4 md:flex'>
            {userId ? (
              <Link href='/dashboard'>
                <Button variant='default'>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Button variant='ghost'>Sign In</Button>
                <Link href='/login'>
                  <Button variant='default'>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='border-border/50 space-y-4 border-t py-4 md:hidden'>
            <a
              href='#features'
              className='text-muted-foreground hover:text-primary block transition-colors'
            >
              Features
            </a>
            <a
              href='#dashboard'
              className='text-muted-foreground hover:text-primary block transition-colors'
            >
              Dashboard
            </a>
            <a
              href='#pricing'
              className='text-muted-foreground hover:text-primary block transition-colors'
            >
              Pricing
            </a>
            <a
              href='#docs'
              className='text-muted-foreground hover:text-primary block transition-colors'
            >
              Docs
            </a>
            <div className='flex flex-col gap-2 pt-4'>
              {userId ? (
                <Link href='/dashboard'>
                  <Button variant='ghost' className='justify-start'>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Button variant='ghost' className='justify-start'>
                    Sign In
                  </Button>
                  <Link href='/login'>
                    <Button variant='default' className='justify-start'>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
