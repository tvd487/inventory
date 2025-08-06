import { UserRole } from '@prisma/client'

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'user:read',
    'user:write',
    'user:delete',
    'admin:access',
    'content:moderate'
  ],
  [UserRole.MODERATOR]: [
    'user:read',
    'content:moderate'
  ],
  [UserRole.USER]: [
    'user:read'
  ],
  [UserRole.GUEST]: []
} as const

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissionsForRole = ROLE_PERMISSIONS[userRole] as readonly string[];
  return permissionsForRole.includes(permission);
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return hasPermission(userRole, 'admin:access')
}

export function canModerateContent(userRole: UserRole): boolean {
  return hasPermission(userRole, 'content:moderate')
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'user:write')
}
