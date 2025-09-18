import { Button } from '@/components/ui/button';
import { Youtube, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='border-border/50 bg-card/50 border-t backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-4'>
          {/* Brand */}
          <div className='col-span-1 space-y-4 md:col-span-2'>
            <div className='flex items-center gap-2'>
              <div className='from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
                <Youtube className='h-5 w-5 text-white' />
              </div>
              <span className='text-xl font-bold'>YouTube AI</span>
            </div>

            <p className='text-muted-foreground max-w-md'>
              The most advanced AI automation platform for YouTube creators.
              Streamline your workflow and boost your channel performance with
              intelligent automation.
            </p>

            <div className='flex gap-3'>
              <Button
                variant='ghost'
                size='icon'
                className='hover:text-primary'
              >
                <Youtube className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='hover:text-primary'
              >
                <Twitter className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='hover:text-primary'
              >
                <Github className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='hover:text-primary'
              >
                <Mail className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className='space-y-4'>
            <h3 className='text-foreground font-semibold'>Product</h3>
            <ul className='space-y-2'>
              {['Features', 'Pricing', 'API', 'Integrations', 'Changelog'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href='#'
                      className='text-muted-foreground hover:text-primary transition-colors'
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div className='space-y-4'>
            <h3 className='text-foreground font-semibold'>Support</h3>
            <ul className='space-y-2'>
              {[
                'Documentation',
                'Help Center',
                'Contact',
                'Status',
                'Community'
              ].map((item) => (
                <li key={item}>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='border-border/50 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row'>
          <p className='text-muted-foreground text-sm'>
            © 2024 YouTube AI Automation. All rights reserved.
          </p>

          <div className='flex gap-6 text-sm'>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Privacy Policy
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Terms of Service
            </a>
            <a
              href='#'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
