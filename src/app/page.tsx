import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <h1 className='text-2xl font-bold'>
        {userId ? `User ID: ${userId}` : 'Not signed in'}
      </h1>
    </div>
  );
}
