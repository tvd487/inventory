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

type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number]

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission as Permission)
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
