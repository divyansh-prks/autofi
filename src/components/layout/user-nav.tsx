'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Settings, Youtube, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function UserNav({
  setShowYouTubeSettings
}: {
  setShowYouTubeSettings: (value: boolean) => void;
}) {
  const { user } = useUser();
  const router = useRouter();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex cursor-pointer items-center gap-2'>
            <Avatar className='border-primary/20 h-10 w-10 border-2'>
              <AvatarImage
                src={user?.imageUrl || '/placeholder.svg'}
                alt={user?.fullName || ''}
              />
              <AvatarFallback className='rounded-lg'>
                {user?.fullName?.slice(0, 2)?.toUpperCase() || 'CN'}
              </AvatarFallback>
            </Avatar>

            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {user?.fullName || ''}
              </span>
              <span className='truncate text-xs'>
                {user?.emailAddresses[0].emailAddress || ''}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {user.fullName}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className='hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white'>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className='hover:text-white' />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className='hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white'>
            <DropdownMenuItem onClick={() => setShowYouTubeSettings(true)}>
              <Youtube className='hover:text-white' />
              YouTube Studio
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white'>
            <LogOut className='hover:text-white' />
            <SignOutButton redirectUrl='/login' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
