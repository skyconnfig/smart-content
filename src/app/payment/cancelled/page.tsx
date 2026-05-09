"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function PaymentCancelledPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
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
        {/* Cancelled icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-copper/10">
          <svg className="h-8 w-8 text-accent-copper" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-2xl text-text-heading">Payment cancelled</h1>
        <p className="mt-2 text-sm text-text-muted">
          No charges were made. You can try again whenever you&apos;re ready.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-md border border-border-light px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-text-dim">
          Need help?{" "}
          <span className="text-accent-teal cursor-default">Contact support</span>
        </p>
      </div>
    </div>
  );
}
