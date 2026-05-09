// ============================================================
// GET /api/user — 获取当前用户的使用状态
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

    const articleCount = await prisma.article.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      email: user.email,
      name: user.name,
      image: user.image,
      freeCount: user.freeCount,
      paidCount: user.paidCount,
      totalArticles: articleCount,
    });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
