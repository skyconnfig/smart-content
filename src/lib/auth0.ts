// ============================================================
// Auth0 Next.js SDK — 服务端会话管理
// Auth0Client 自动从环境变量读取配置：
//   AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET
// ============================================================

import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();
