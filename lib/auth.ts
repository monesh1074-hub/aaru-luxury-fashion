import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { cookies, headers } from "next/headers"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-jwt"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const headersList = await headers()
    const cookieStore = await cookies()

    let token: string | null = null

    // 1. Try Authorization header (Bearer token) first
    const authHeader = headersList.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }

    // 2. Fall back to cookie if no Bearer token
    if (!token) {
      token = cookieStore.get("aaru_auth_token")?.value || null
    }

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user || !user.isActive) return null

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (e) {
    return null
  }
}
