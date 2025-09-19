'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Youtube,
  Key,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!apiKey || !clientSecret) {
      toast.error('Missing credentials', {
        description: 'Please provide both API key and client secret.'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success('Successfully connected!', {
        description: 'Your YouTube Studio integration is now active.'
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey('');
    setClientSecret('');
    toast.success('Disconnected', {
      description: 'YouTube Studio integration has been disabled.'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Youtube className='text-primary h-5 w-5' />
            YouTube Studio Integration
          </DialogTitle>
          <DialogDescription>
            Connect your YouTube Studio account to directly update video titles,
            descriptions, and tags.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='setup' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='setup'>Setup</TabsTrigger>
            <TabsTrigger value='guide'>Setup Guide</TabsTrigger>
          </TabsList>

          <TabsContent value='setup' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Key className='h-4 w-4' />
                  API Credentials
                </CardTitle>
                <CardDescription>
                  Enter your YouTube Data API v3 credentials to enable direct
                  integration.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isConnected ? (
                  <div className='space-y-4'>
                    <Alert>
                      <CheckCircle className='h-4 w-4' />
                      <AlertDescription className='flex items-center justify-between'>
                        <span>YouTube Studio integration is active</span>
                        <Badge variant='secondary' className='gap-1'>
                          <CheckCircle className='h-3 w-3' />
                          Connected
                        </Badge>
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant='outline'
                      onClick={handleDisconnect}
                      className='w-full bg-transparent'
                    >
                      Disconnect Integration
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='api-key'>YouTube Data API Key</Label>
                      <Input
                        id='api-key'
                        type='password'
                        placeholder='AIzaSyC...'
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='client-secret'>
                        OAuth 2.0 Client Secret
                      </Label>
                      <Input
                        id='client-secret'
                        type='password'
                        placeholder='GOCSPX-...'
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                      />
                    </div>

                    <Alert>
                      <Shield className='h-4 w-4' />
                      <AlertDescription>
                        Your credentials are stored securely and only used for
                        YouTube API requests.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleConnect}
                      disabled={isLoading}
                      className='w-full'
                    >
                      {isLoading ? 'Connecting...' : 'Connect YouTube Studio'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Permissions</CardTitle>
                <CardDescription>
                  The following YouTube API scopes are required for full
                  functionality:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <code>youtube.force-ssl</code> - Manage your YouTube account
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <code>youtube.upload</code> - Upload and manage videos
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <code>youtube.readonly</code> - View your YouTube account
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='guide' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>How to Get YouTube API Credentials</CardTitle>
                <CardDescription>
                  Follow these steps to set up your YouTube Data API access.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  <div className='flex gap-4'>
                    <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      1
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>
                        Create a Google Cloud Project
                      </h4>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        Go to the Google Cloud Console and create a new project
                        or select an existing one.
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2 gap-2 bg-transparent'
                      >
                        <ExternalLink className='h-3 w-3' />
                        Open Google Cloud Console
                      </Button>
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      2
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>
                        Enable YouTube Data API v3
                      </h4>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        In the API Library, search for "YouTube Data API v3" and
                        enable it for your project.
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      3
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>Create API Credentials</h4>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        Go to Credentials → Create Credentials → API Key. Also
                        create OAuth 2.0 Client ID for web application.
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      4
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>Configure OAuth Consent</h4>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        Set up the OAuth consent screen and add the required
                        YouTube API scopes.
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      5
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium'>Copy Your Credentials</h4>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        Copy your API key and OAuth 2.0 client secret, then
                        paste them in the Setup tab.
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    <strong>Important:</strong> Keep your API credentials secure
                    and never share them publicly. These credentials allow
                    access to your YouTube account.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
