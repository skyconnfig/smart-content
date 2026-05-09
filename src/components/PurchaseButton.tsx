"use client";

import { useState } from "react";

interface PurchaseButtonProps {
  email: string;
  tier: "creator" | "pro";
  credits: number;
  price: string;
  label?: string;
}

export default function PurchaseButton({ email, tier, credits, price, label }: PurchaseButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data.url) window.location.href = data.url;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Please try again.";
      console.error("Purchase error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : (label || `Buy ${credits} Credits — $${price}`)}
      </button>
      {error && (
        <p className="mt-1.5 text-xs text-accent-copper">{error}</p>
      )}
    </div>
  );
}
