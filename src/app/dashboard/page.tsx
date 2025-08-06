'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FolderOpen, Package, Settings, Truck, Users } from 'lucide-react';
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
    return <div className="flex items-center justify-center h-full">Đang tải...</div>;
  }

  if (!session) {
    return null;
  }

  const navigationCards = [
    {
      title: 'Sản phẩm',
      description: 'Quản lý sản phẩm trong kho hàng',
      icon: Package,
      href: '/dashboard/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Danh mục',
      description: 'Tổ chức sản phẩm theo danh mục',
      icon: FolderOpen,
      href: '/dashboard/categories',
      color: 'bg-green-500',
    },
    {
      title: 'Nhà cung cấp',
      description: 'Quản lý nhà cung cấp sản phẩm',
      icon: Truck,
      href: '/dashboard/suppliers',
      color: 'bg-purple-500',
    },
    {
      title: 'Phân tích',
      description: 'Xem báo cáo và phân tích kho hàng',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'bg-orange-500',
    },
    {
      title: 'Người dùng',
      description: 'Quản lý người dùng và quyền hạn',
      icon: Users,
      href: '/dashboard/users',
      color: 'bg-red-500',
    },
    {
      title: 'Cài đặt',
      description: 'Cấu hình hệ thống',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-2">
            Chào mừng trở lại! Đây là tổng quan hệ thống quản lý kho hàng của bạn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${card.color} text-white`}>
                      <card.icon className="h-6 w-6"/>
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity to display.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Suppliers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
