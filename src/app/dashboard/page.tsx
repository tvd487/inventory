'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ID:</strong> {session.user.id}</p>
                <p><strong>Username:</strong> {session.user.username}</p>
                <p><strong>Email:</strong> {session.user.email || 'N/A'}</p>
                <p><strong>Name:</strong> {session.user.name || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Access Token:</strong> {session.accessToken.substring(0, 20)}...</p>
                <p><strong>Refresh Token:</strong> {session.refreshToken.substring(0, 20)}...</p>
                <p><strong>Token Expires:</strong> {
                  session.tokenExpires
                    ? new Date(session.tokenExpires).toLocaleString()
                    : 'N/A'
                }</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
