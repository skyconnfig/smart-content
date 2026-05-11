// ============================================================
// POST /api/creem/checkout
// 创建 Creem 支付会话，返回支付页面 URL
// 支持 "creator" (30 credits, $4.99) 和 "pro" (200 credits, $12.99)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const CREEM_API_KEY = process.env.CREEM_API_KEY || "";

/// 套餐配置映射
const TIER_CONFIG: Record<string, { productId: string; credits: number }> = {
  creator: {
    productId: process.env.CREEM_PRODUCT_ID_CREATOR || "",
    credits: 30,
  },
  pro: {
    productId: process.env.CREEM_PRODUCT_ID_PRO || "",
    credits: 200,
  },
};

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // 2. 解析 tier 参数
    const body = await request.json();
    const tier: string = body.tier || "creator";

    const config = TIER_CONFIG[tier];
    if (!config || !config.productId) {
      return NextResponse.json({ error: "Invalid tier or product not configured" }, { status: 400 });
    }

    // 3. 验证 API key
    if (!CREEM_API_KEY) {
      console.error("Creem: missing API key");
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    // 4. 调用 Creem API 创建 checkout session
    // 文档: https://docs.creem.io/skills/creem-api/Skill#creem-api-integration-skill
    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CREEM_API_KEY,
      },
      body: JSON.stringify({
        product_id: config.productId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/thank-you?tier=${tier}`,
        customer: { email: userEmail },
        metadata: {
          email: userEmail,
          tier,
          unlock_count: String(config.credits),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Creem API error:", response.status, errorText);
      let message = "Payment service error";
      try {
        const err = JSON.parse(errorText);
        if (err.message) message = err.message;
      } catch { /* ignore parse errors */ }
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.checkout_url || data.url,
      sessionId: data.id,
    });
  } catch (error) {
    console.error("Creem checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
