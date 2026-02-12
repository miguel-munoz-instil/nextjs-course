import SilksongLogo from '@/app/ui/silksong-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-black">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-thorny-red p-3 md:h-36">
          <div className="w-32 text-silk-white md:w-36">
            <SilksongLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}