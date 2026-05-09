// ============================================================
// Prisma Client Singleton
// 防止开发环境热重载时创建多个 PrismaClient 实例
// ============================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * 查找或创建用户
 * Auth0 SDK 不会自动在数据库创建用户记录，
 * 需要在首次访问 API 时按需创建。
 */
export async function ensureUser(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, freeCount: 2 },
    });
  }
  return user;
}

export default prisma;
