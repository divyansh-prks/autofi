import { auth } from '@clerk/nextjs/server';
import Hero from '@/components/landing/hero';
import GSAPFeatures from '@/components/landing/features';
import Dashboard from '@/components/landing/dashboard';
import Footer from '@/components/landing/footer';
import Navigation from '@/components/landing/navigation';

export default async function Page() {
  const { userId } = await auth();

  return (
    <main className=''>
      <Navigation userId={userId} />
      <Hero />
      <GSAPFeatures />
      <Dashboard />
      <Footer />
    </main>
  );
}
