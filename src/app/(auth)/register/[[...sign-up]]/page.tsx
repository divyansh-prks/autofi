import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoFi | Register',
  description: 'Register page for authentication.'
};

export default async function RegisterPage() {
  return (
    <ClerkSignUpForm
      initialValues={{
        emailAddress: 'autofi_demo@gmail.com'
      }}
    />
  );
}
