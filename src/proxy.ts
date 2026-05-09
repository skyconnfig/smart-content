// ============================================================
// Next.js 16 Proxy — 处理 Auth0 认证路由
// 自动挂载：
//   /auth/login   → Auth0 登录页
//   /auth/logout  → 登出
//   /auth/callback → OAuth 回调
//   /auth/profile  → 用户信息 JSON
// ============================================================

import { auth0 } from "@/lib/auth0";

export async function proxy(request: Request) {
  return auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
