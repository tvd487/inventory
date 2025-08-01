import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken, getTokenExpiration } from '@/lib/jwt'
import { UserStatus } from '@prisma/client'

// Add refresh token function
async function refreshAccessToken(token: any) {
  try {
    // Get user from database to verify refresh token
    const user = await prisma.user.findUnique({
      where: { id: parseInt(token.sub!) }
    })

    if (!user || user.refreshToken !== token.refreshToken) {
      throw new Error('Invalid refresh token')
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    }
    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    })

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenExpires: getTokenExpiration(newAccessToken),
      error: undefined
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null
        }

        // Check if user is active
        if (user.status !== UserStatus.ACTIVE) {
          throw new Error('Account is not active')
        }

        const tokenPayload = {
          userId: user.id,
          username: user.username,
          role: user.role
        }
        const accessToken = generateAccessToken(tokenPayload)
        const refreshToken = generateRefreshToken(tokenPayload)

        // Store refresh token and update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            refreshToken,
            lastLoginAt: new Date()
          }
        })

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          accessToken,
          refreshToken,
          tokenExpires: getTokenExpiration(accessToken)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.tokenExpires = user.tokenExpires
        token.username = user.username
        token.role = user.role
        token.status = user.status
        return token
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.tokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.username = token.username as string
      session.user.role = token.role
      session.user.status = token.status
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.tokenExpires = token.tokenExpires as number
      session.error = token.error
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: 'jwt'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
