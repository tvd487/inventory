import jwt from 'jsonwebtoken';
import {prisma} from "@/lib/prisma";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface TokenPayload {
  userId: number;
  username: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export async function refreshAccessToken(token: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(token.sub!) }
    })

    if (!user || user.refreshToken !== token.refreshToken) {
      throw new Error('Invalid refresh token')
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    }
    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

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

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}
