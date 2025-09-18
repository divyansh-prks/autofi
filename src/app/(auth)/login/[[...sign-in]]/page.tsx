import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoFi | Login',
  description: 'Login page for authentication.'
};

export default async function LoginPage() {
  return (
    <ClerkSignInForm
      initialValues={{
        emailAddress: 'autofi_demo@gmail.com'
      }}
    />
  );
}
