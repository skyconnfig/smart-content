// ============================================================
// POST /api/creem/checkout
// 创建 Creem 支付会话，返回支付页面 URL
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const CREEM_API_KEY = process.env.CREEM_API_KEY || "";
const CREEM_PRODUCT_ID = process.env.CREEM_PRODUCT_ID || "";

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // 2. 验证配置
    if (!CREEM_API_KEY || !CREEM_PRODUCT_ID) {
      console.error("Creem: missing API key or product ID");
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    // 3. 调用 Creem API 创建 checkout session
    // 参考 Creem API 文档: https://docs.creem.io
    const response = await fetch("https://api.creem.io/v1/checkout-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CREEM_API_KEY,
      },
      body: JSON.stringify({
        product_id: CREEM_PRODUCT_ID,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?purchase=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?purchase=cancelled`,
        customer_email: userEmail,
        metadata: {
          email: userEmail,
          unlock_count: "10", // 每次购买解锁 10 次生成
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Creem API error:", response.status, errorText);
      return NextResponse.json({ error: "Payment service error" }, { status: 502 });
    }

    const data = await response.json();

    // 4. 返回支付页面 URL
    return NextResponse.json({
      url: data.checkout_url || data.url,
      sessionId: data.id,
    });
  } catch (error) {
    console.error("Creem checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
