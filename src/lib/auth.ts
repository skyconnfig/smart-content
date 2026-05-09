// ============================================================
// NextAuth v5 配置
// 支持 Auth0、GitHub、Google 等 OAuth 提供商
// ============================================================

import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET && process.env.AUTH0_ISSUER
      ? [
          Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER,
          }),
        ]
      : []),
    // Fallback: email-only auth via Resend (magic link)
    ...(process.env.RESEND_API_KEY
      ? [
          Resend({
            from: process.env.EMAIL_FROM || "noreply@lxs.best",
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user }) {
      // 用户首次登录时，PrismaAdapter 会自动创建用户
      // freeCount 默认值由 schema 中的 @default(2) 控制
      if (user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });
        }
      }
      return true;
    },
  },
});
