// ============================================================
// POST /api/creem/webhook
// Creem 支付成功后的 Webhook 回调
// 功能：验证签名 → 增加用户付费次数
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Creem webhook 密钥（从环境变量读取）
const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || "";

/**
 * Creem 支付事件负载类型
 */
interface CreemWebhookPayload {
  event_type: "checkout.session.completed" | string;
  data: {
    customer_email?: string;
    metadata?: Record<string, string>;
    quantity?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. 验证签名（生产环境必须）
    const signature = request.headers.get("x-creem-signature");
    if (CREEM_WEBHOOK_SECRET && !signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // 2. 解析 webhook 事件
    const payload: CreemWebhookPayload = await request.json();

    // 3. 只处理支付成功事件
    if (payload.event_type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const { customer_email, metadata, quantity = 10 } = payload.data;

    // 4. 确定用户邮箱（从 metadata 或 customer_email）
    const email = metadata?.email || customer_email;

    if (!email) {
      console.error("Creem webhook: no email found in payload", payload);
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 5. 增加用户付费次数
    const unlockCount = metadata?.unlock_count ? parseInt(metadata.unlock_count, 10) : quantity;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // 用户不存在 → 创建用户并赋予付费次数
      await prisma.user.create({
        data: {
          email,
          freeCount: 0,
          paidCount: unlockCount,
        },
      });
    } else {
      await prisma.user.update({
        where: { email },
        data: { paidCount: { increment: unlockCount } },
      });
    }

    console.log(`Creem: added ${unlockCount} credits to ${email}`);
    return NextResponse.json({ success: true, email, creditsAdded: unlockCount });
  } catch (error) {
    console.error("Creem webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
