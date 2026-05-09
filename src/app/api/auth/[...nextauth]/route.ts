// ============================================================
// NextAuth v5 API Route Handler
// 处理所有 /api/auth/* 请求
// ============================================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
