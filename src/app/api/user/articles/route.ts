// ============================================================
// GET /api/user/articles — 获取当前用户的文章列表
// ============================================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, ensureUser } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await ensureUser(userEmail);

    const articles = await prisma.article.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Articles API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
