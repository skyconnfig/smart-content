// ============================================================
// NextAuth v5 配置 — 多 Provider 支持 (Auth0 / GitHub / Google)
// ============================================================

import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
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
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
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
    async signIn() {
      // PrismaAdapter 在 OAuth 回调中自动创建 User，
      // freeCount 默认值由 schema 中的 @default(2) 控制
      return true;
    },
  },
});
