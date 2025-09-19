import { UserProfile } from '@clerk/nextjs';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col place-items-center p-4'>
      <UserProfile />
    </div>
  );
}
