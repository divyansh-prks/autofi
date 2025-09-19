'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  User,
  Settings,
  LogOut,
  Crown,
  TrendingUp,
  Eye,
  Users
} from 'lucide-react';

interface UserStats {
  subscribers: string;
  totalViews: string;
  avgViews: string;
  engagementRate: string;
}

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    plan: 'free' | 'pro' | 'enterprise';
    stats: UserStats;
  };
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function UserProfile({
  user,
  onSettingsClick,
  onLogoutClick
}: UserProfileProps) {
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro':
        return (
          <Badge className='bg-primary text-primary-foreground gap-1'>
            <Crown className='h-3 w-3' />
            Pro
          </Badge>
        );
      case 'enterprise':
        return (
          <Badge className='from-primary to-secondary gap-1 bg-gradient-to-r text-white'>
            <Crown className='h-3 w-3' />
            Enterprise
          </Badge>
        );
      default:
        return <Badge variant='outline'>Free</Badge>;
    }
  };

  return (
    <div className='flex items-center gap-4'>
      {/* User Stats Cards - Hidden on mobile */}
      <div className='hidden items-center gap-3 lg:flex'>
        <Card className='bg-card/50 border-border/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <Users className='text-primary h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-xs'>Subscribers</p>
                <p className='text-sm font-semibold'>
                  {user.stats.subscribers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card/50 border-border/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <Eye className='text-primary h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-xs'>Avg Views</p>
                <p className='text-sm font-semibold'>{user.stats.avgViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card/50 border-border/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='text-primary h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-xs'>Engagement</p>
                <p className='text-sm font-semibold'>
                  {user.stats.engagementRate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='hover:bg-muted/50 flex h-auto items-center gap-3 p-2'
          >
            <div className='flex items-center gap-3'>
              <Avatar className='border-primary/20 h-10 w-10 border-2'>
                <AvatarImage
                  src={user.avatar || '/placeholder.svg'}
                  alt={user.name}
                />
                <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='hidden text-left sm:block'>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  {getPlanBadge(user.plan)}
                </div>
                <p className='text-muted-foreground text-xs'>{user.email}</p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-64'>
          <div className='border-b p-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12'>
                <AvatarImage
                  src={user.avatar || '/placeholder.svg'}
                  alt={user.name}
                />
                <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{user.name}</p>
                <p className='text-muted-foreground text-sm'>{user.email}</p>
                <div className='mt-1'>{getPlanBadge(user.plan)}</div>
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className='border-b p-3 lg:hidden'>
            <div className='grid grid-cols-2 gap-3 text-center'>
              <div>
                <p className='text-muted-foreground text-xs'>Subscribers</p>
                <p className='text-sm font-semibold'>
                  {user.stats.subscribers}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-xs'>Avg Views</p>
                <p className='text-sm font-semibold'>{user.stats.avgViews}</p>
              </div>
            </div>
          </div>

          <DropdownMenuItem onClick={onSettingsClick} className='gap-2'>
            <Settings className='h-4 w-4' />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem className='gap-2'>
            <User className='h-4 w-4' />
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogoutClick}
            className='text-destructive focus:text-destructive gap-2'
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
