'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle/>
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Chào mừng bạn đến với TV Logistics
        </h1>

        {session ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Xin chào, {session.user.username}!
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Vào trang quản lý
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Vui lòng đăng nhập trước khi vào trang quản lý
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
