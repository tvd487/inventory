'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Package, FolderOpen, Truck, BarChart3, Users, Settings } from 'lucide-react';
import Link from 'next/link';

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

  const navigationCards = [
    {
      title: 'Products',
      description: 'Manage your inventory products',
      icon: Package,
      href: '/dashboard/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      description: 'Organize products by categories',
      icon: FolderOpen,
      href: '/dashboard/categories',
      color: 'bg-green-500',
    },
    {
      title: 'Suppliers',
      description: 'Manage your product suppliers',
      icon: Truck,
      href: '/dashboard/suppliers',
      color: 'bg-purple-500',
    },
    {
      title: 'Analytics',
      description: 'View inventory analytics and reports',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'bg-orange-500',
    },
    {
      title: 'Users',
      description: 'Manage system users and permissions',
      icon: Users,
      href: '/dashboard/users',
      color: 'bg-red-500',
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${card.color} text-white`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
