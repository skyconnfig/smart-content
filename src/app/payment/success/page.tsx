"use client";

import { Suspense, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/// 套餐 → 积分数映射
const TIER_CREDITS: Record<string, number> = {
  creator: 30,
  pro: 200,
};

function SuccessContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const tier = searchParams.get("tier") || "creator";
  const credits = TIER_CREDITS[tier] || 30;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-teal/10">
          <svg className="h-8 w-8 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-2xl text-text-heading">Payment successful</h1>
        <p className="mt-2 text-sm text-text-muted">
          Your credits have been added. You&apos;re ready to generate more content.
        </p>

        {/* Credit details */}
        <div className="mt-8 rounded-lg border border-border-light bg-bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Plan</span>
            <span className="font-semibold text-text-heading capitalize">{tier}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3 text-sm">
            <span className="text-text-muted">Credits added</span>
            <span className="font-semibold text-accent-teal">+{credits}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3 text-sm">
            <span className="text-text-muted">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Completed
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
          >
            Generate Content Now
          </Link>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-md border border-border-light px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="mt-6 text-xs text-text-dim">
          Redirecting to dashboard in {countdown} second{countdown !== 1 ? "s" : ""} &hellip;
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-teal border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
