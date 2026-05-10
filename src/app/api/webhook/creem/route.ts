// ============================================================
// POST /api/webhook/creem
// Creem 支付 Webhook — 付款成功后为用户增加次数
// 需要在 Creem Dashboard → Developers → Webhooks 配置此地址
// 文档: https://docs.creem.io
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || "";

/// 套餐 → 积分数映射（与 checkout API 保持一致）
const TIER_CREDITS: Record<string, number> = {
  creator: 30,
  pro: 200,
};

/**
 * 从签名头中提取出原始的 hex 签名值
 * 兼容格式: "sha256=abc123..." 或 "abc123..." 或 "t=...,v1=..."
 */
function extractSignature(raw: string): string | null {
  // 去掉可能的 "sha256=" 前缀
  let sig = raw.replace(/^sha256[=:]?\s*/i, "");

  // 去掉可能的 "v1=" 前缀 (Stripe 风格)
  sig = sig.replace(/^v1[=:]?\s*/i, "");

  // 如果包含逗号（如 t=...,v1=...），取最后一段
  if (sig.includes(",")) {
    const parts = sig.split(",").map((p) => p.trim());
    for (const p of parts) {
      if (p.startsWith("v1=") || p.startsWith("sha256=")) {
        sig = p.replace(/^(v1|sha256)[=:]?\s*/i, "");
        break;
      }
    }
  }

  return sig.length > 0 ? sig : null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. 读取原始请求体（HMAC 验签需要原始字符串）
    const rawBody = await request.text();

    // 2. 验证 Webhook 签名（防止伪造请求）
    const signature = request.headers.get("creem-signature");

    if (CREEM_WEBHOOK_SECRET && signature) {
      const rawSig = extractSignature(signature);

      if (!rawSig) {
        console.error("Creem webhook: could not parse signature header", signature);
        return NextResponse.json({ error: "Invalid signature format" }, { status: 401 });
      }

      // 尝试 hex 比较
      const computedHex = crypto
        .createHmac("sha256", CREEM_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (computedHex === rawSig) {
        // hex 匹配通过
      } else {
        // 尝试 base64 比较
        const computedBase64 = crypto
          .createHmac("sha256", CREEM_WEBHOOK_SECRET)
          .update(rawBody)
          .digest("base64");

        if (computedBase64 === rawSig) {
          // base64 匹配通过
        } else {
          // 两种都不匹配 → 记录日志便于调试
          console.error("Creem webhook: signature mismatch");
          console.error("  signature header:", signature);
          console.error("  extracted sig:", rawSig);
          console.error("  computed hex:", computedHex);
          console.error("  computed b64:", computedBase64);
          console.error("  body preview:", rawBody.substring(0, 200));
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      }
    }

    // 3. 解析事件
    const event = JSON.parse(rawBody);
    const eventType = event.eventType as string;
    const data = event.object || event.data || {};

    console.log(`Creem webhook received: ${eventType}`);

    // 4. 处理支付成功事件
    if (eventType === "checkout.completed") {
      // 从 metadata 中提取用户信息（我们在创建 checkout 时传入的）
      const metadata = data.metadata || {};
      const email = metadata.email || data.customer?.email;
      const tier = metadata.tier || "creator";
      const unlockCount = parseInt(metadata.unlock_count || String(TIER_CREDITS[tier] || 30), 10);

      if (!email) {
        console.error("Creem webhook: no email in payload", data);
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
      }

      // 增加用户的付费次数
      await prisma.user.upsert({
        where: { email },
        update: {
          paidCount: { increment: unlockCount },
        },
        create: {
          email,
          freeCount: 2,
          paidCount: unlockCount,
        },
      });

      console.log(`Creem webhook: added ${unlockCount} credits to ${email}`);
    }

    // 5. 处理退款事件（扣回对应次数）
    if (eventType === "checkout.refunded") {
      const metadata = data.metadata || {};
      const email = metadata.email || data.customer?.email;
      const unlockCount = parseInt(
        metadata.unlock_count || "30",
        10
      );

      if (email) {
        await prisma.user.update({
          where: { email },
          data: {
            paidCount: { decrement: unlockCount },
          },
        });
        console.log(`Creem webhook: removed ${unlockCount} credits from ${email} (refund)`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Creem webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Webhook 只接受 POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
