import Header from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | AutoFi',
  description: 'Youtube content seo optimization tool'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
