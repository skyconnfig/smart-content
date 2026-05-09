"use client";

interface PurchaseButtonProps {
  email: string;
  tier: "creator" | "pro";
  credits: number;
  price: string;
  label?: string;
}

export default function PurchaseButton({ email, tier, credits, price, label }: PurchaseButtonProps) {
  const handlePurchase = async () => {
    try {
      const response = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier }),
      });

      if (!response.ok) throw new Error("Failed to create checkout");

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Failed to initiate purchase. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePurchase}
      className="rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
    >
      {label || `Buy ${credits} Credits — $${price}`}
    </button>
  );
}
