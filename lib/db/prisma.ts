import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Gracefully handle database unavailability (e.g., on Vercel with SQLite)
let prismaInstance: PrismaClient | null = null

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
} catch (error) {
  console.warn('Prisma client initialization failed. Running without database.')
  prismaInstance = null
}

export const prisma = prismaInstance as PrismaClient
