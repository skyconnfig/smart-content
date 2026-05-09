// ============================================================
// POST /api/generate
// AI 文案生成接口
// 流程：校验用户 → 检查免费次数 → 调用 DeepSeek → 保存文章 → 返回结果
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { generateText } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const session = await auth0.getSession();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // 2. 解析请求参数
    const body = await request.json();
    const { keyword, template } = body as {
      keyword?: string;
      template?: string;
    };

    if (!keyword || !keyword.trim()) {
      return NextResponse.json({ error: "Please enter a keyword or topic" }, { status: 400 });
    }

    if (!template) {
      return NextResponse.json({ error: "Please select a template style" }, { status: 400 });
    }

    // 3. 查询用户及剩余次数
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalRemaining = user.freeCount + user.paidCount;

    if (totalRemaining <= 0) {
      return NextResponse.json(
        {
          error: "You've used all your free credits. Please purchase more to continue.",
          needsPurchase: true,
          freeCount: 0,
          paidCount: 0,
        },
        { status: 403 }
      );
    }

    // 4. 调用 OpenAI 生成文案
    const content = await generateText(keyword.trim(), template);

    if (!content) {
      return NextResponse.json({ error: "Failed to generate content. Please try again." }, { status: 500 });
    }

    // 5. 保存文章到数据库
    await prisma.article.create({
      data: {
        userId: user.id,
        title: keyword.trim(),
        content,
        template,
      },
    });

    // 6. 更新用户剩余次数（优先扣免费次数）
    const updateData =
      user.freeCount > 0
        ? { freeCount: { decrement: 1 } }
        : { paidCount: { decrement: 1 } };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // 7. 返回成功结果
    return NextResponse.json({
      content,
      remainingFree: updatedUser.freeCount,
      remainingPaid: updatedUser.paidCount,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
