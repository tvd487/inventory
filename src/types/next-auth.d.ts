import 'next-auth'
import { UserRole, UserStatus } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    username: string
    email?: string | null
    name?: string | null
    role: UserRole
    status: UserStatus
    accessToken: string
    refreshToken: string
    tokenExpires: number | null
  }

  interface Session {
    user: {
      id: string
      username: string
      email?: string | null
      name?: string | null
      role: UserRole
      status: UserStatus
    }
    accessToken: string
    refreshToken: string
    tokenExpires: number | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    refreshToken: string
    tokenExpires: number | null
    username: string
    role: UserRole
    status: UserStatus
  }
}
