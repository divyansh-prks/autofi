import { auth } from '@clerk/nextjs/server';

export default async function Dashboard() {
  const { userId } = await auth();

  return <div>Dashboard for user {userId}</div>;
}
