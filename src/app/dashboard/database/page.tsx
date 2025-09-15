'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Loader2,
  Database,
  RefreshCw,
  Users,
  FileText,
  Plus,
  Eye
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DatabaseStats {
  users: number;
  scripts: number;
  totalDocuments: number;
  databaseSize: string;
}

interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface Script {
  _id: string;
  userId: string;
  originalFilename: string;
  processingStatus: string;
  llmProvider: string;
  createdAt: string;
  updatedAt: string;
}

export default function DatabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/database/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Database Seeded Successfully', {
          description: `Added ${result.usersCreated} users and ${result.scriptsCreated} scripts to the database.`
        });
        await fetchData();
      } else {
        throw new Error(result.error || 'Failed to seed database');
      }
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to seed database'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, scriptsRes] = await Promise.all([
        fetch('/api/database/stats'),
        fetch('/api/database/users'),
        fetch('/api/database/scripts')
      ]);

      const [statsData, usersData, scriptsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        scriptsRes.json()
      ]);

      if (statsRes.ok) setStats(statsData);
      if (usersRes.ok) setUsers(usersData);
      if (scriptsRes.ok) setScripts(scriptsData);

      toast.success('Data Refreshed', {
        description: 'Database information has been updated.'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to fetch database information'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/database/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Database Cleared', {
          description: `Removed ${result.deletedUsers} users and ${result.deletedScripts} scripts.`
        });
        setStats(null);
        setUsers([]);
        setScripts([]);
      } else {
        throw new Error(result.error || 'Failed to clear database');
      }
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to clear database'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Database Management
        </h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={fetchData} variant='outline' disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='h-4 w-4' />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='users'>Users</TabsTrigger>
          <TabsTrigger value='scripts'>Scripts</TabsTrigger>
          <TabsTrigger value='actions'>Actions</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Users
                </CardTitle>
                <Users className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats?.users ?? '--'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Scripts
                </CardTitle>
                <FileText className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats?.scripts ?? '--'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Documents
                </CardTitle>
                <Database className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats?.totalDocuments ?? '--'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Database Size
                </CardTitle>
                <Database className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats?.databaseSize ?? '--'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='users' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>All users in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[600px]'>
                <div className='space-y-4'>
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>{user.username}</p>
                        <p className='text-muted-foreground text-sm'>
                          {user.email}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Created:{' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='space-y-1 text-right'>
                        <p className='text-muted-foreground text-xs'>
                          ID: {user._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className='text-muted-foreground py-8 text-center'>
                      No users found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='scripts' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Scripts ({scripts.length})</CardTitle>
              <CardDescription>All scripts in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[600px]'>
                <div className='space-y-4'>
                  {scripts.map((script) => (
                    <div
                      key={script._id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>
                          {script.originalFilename}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          User ID: {script.userId.slice(-8)}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Created:{' '}
                          {new Date(script.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='space-y-1 text-right'>
                        <Badge
                          variant={
                            script.processingStatus === 'completed'
                              ? 'default'
                              : script.processingStatus === 'failed'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {script.processingStatus}
                        </Badge>
                        <p className='text-muted-foreground text-xs'>
                          {script.llmProvider}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          ID: {script._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {scripts.length === 0 && (
                    <p className='text-muted-foreground py-8 text-center'>
                      No scripts found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='actions' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Plus className='h-5 w-5' />
                  Seed Database
                </CardTitle>
                <CardDescription>
                  Add sample data to the database for testing purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={seedDatabase}
                  disabled={isLoading}
                  className='w-full'
                >
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Plus className='mr-2 h-4 w-4' />
                  )}
                  Seed Database
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Load Data
                </CardTitle>
                <CardDescription>
                  Load and display current database information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={fetchData}
                  disabled={isLoading}
                  variant='outline'
                  className='w-full'
                >
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Eye className='mr-2 h-4 w-4' />
                  )}
                  Load Data
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <Card className='border-destructive/50'>
            <CardHeader>
              <CardTitle className='text-destructive'>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will permanently delete data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={clearDatabase}
                disabled={isLoading}
                variant='destructive'
                className='w-full'
              >
                {isLoading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Database className='mr-2 h-4 w-4' />
                )}
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
