'use client';

import { Button } from '@/components/ui/button';
import { Youtube, Menu } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='glass border-border/50 fixed top-0 right-0 left-0 z-50 border-b'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
              <Youtube className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold'>YouTube AI</span>
          </div>

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
            <Button variant='ghost'>Sign In</Button>
            <Button variant='ghost'>Get Started</Button>
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
              <Button variant='ghost' className='justify-start'>
                Sign In
              </Button>
              <Button variant='ghost' className='justify-start'>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
