'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Settings, Shield, Users } from 'lucide-react';
import { canAccessAdmin, hasPermission } from '@/lib/permissions';

export function RoleDashboard() {
  const { data: session } = useSession();

  if (!session) return null;

  const { user } = session;
  const roleColor = {
    ADMIN: 'bg-red-500',
    MODERATOR: 'bg-blue-500',
    USER: 'bg-green-500',
    GUEST: 'bg-gray-500',
  }[user.role];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Role</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground"/>
        </CardHeader>
        <CardContent>
          <Badge className={`${roleColor} text-white`}>
            {user.role}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Status: {user.status}
          </p>
        </CardContent>
      </Card>

      {canAccessAdmin(user.role) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Access</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Available</div>
            <p className="text-xs text-muted-foreground">
              Full system access granted
            </p>
          </CardContent>
        </Card>
      )}

      {hasPermission(user.role, 'content:moderate') && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderation</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Enabled</div>
            <p className="text-xs text-muted-foreground">
              Can moderate content
            </p>
          </CardContent>
        </Card>
      )}

      {hasPermission(user.role, 'user:write') && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Can manage users
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
