"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import PurchaseButton from "@/components/PurchaseButton";
import type { UserUsage } from "@/types";

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-bg-surface p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-2 font-serif text-3xl ${accent}`}>{value}</p>
    </div>
  );
}

// ─── Inner content ───────────────────────────────────────────
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const purchase = searchParams.get("purchase");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        const [u, a] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/user/articles"),
        ]);
        if (u.ok) setUsage(await u.json());
        if (a.ok) setArticles((await a.json()).articles || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  // ── Skeleton ──
  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-bg-elevated" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      {/* ── Purchase banners ── */}
      {purchase === "success" && (
        <div className="mb-8 rounded-lg border border-accent-teal/20 bg-accent-teal-bg p-4 text-sm text-accent-teal">
          Purchase successful! Your credits have been added.
        </div>
      )}
      {purchase === "cancelled" && (
        <div className="mb-8 rounded-lg border border-border-light bg-bg-elevated p-4 text-sm text-text-muted">
          Purchase cancelled — no charges made.
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-text-heading">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          New Generation
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Free Credits" value={usage?.freeCount ?? "—"} accent="text-accent-teal" />
        <StatCard label="Paid Credits" value={usage?.paidCount ?? "—"} accent="text-accent-copper" />
        <StatCard label="Total Articles" value={usage?.totalArticles ?? 0} accent="text-text-heading" />
      </div>

      {/* ── Upsell ── */}
      {usage && usage.freeCount < 1 && (
        <div className="mt-8 rounded-lg border border-accent-teal/20 bg-accent-teal-bg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-lg text-text-heading">Need more credits?</h2>
              <p className="mt-1 text-sm text-text-muted">
                Get <strong className="text-text-body">10 additional generations</strong> — one-time purchase, no subscription.
              </p>
            </div>
            <PurchaseButton email={session?.user?.email || ""} />
          </div>
        </div>
      )}

      {/* ── Articles ── */}
      <div className="mt-14">
        <h2 className="font-serif text-lg text-text-heading">Your articles</h2>

        {articles.length === 0 ? (
          <div className="mt-5 rounded-lg border border-border-light bg-bg-surface p-16 text-center shadow-sm">
            <svg className="mx-auto h-14 w-14 text-text-dim" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="mt-4 font-serif text-lg text-text-heading">No articles yet</p>
            <p className="mt-1 text-sm text-text-muted">Generate your first piece from the homepage.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
            >
              Generate Your First Article
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 stagger">
            {articles.map((a: any) => (
              <div key={a.id} className="animate-fade-in-up">
                <ArticleCard
                  title={a.title}
                  template={a.template}
                  createdAt={a.createdAt}
                  preview={a.content.substring(0, 160)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {usage && usage.totalArticles > 0 && (
        <p className="mt-10 text-center text-xs text-text-dim">
          {usage.totalArticles} article{usage.totalArticles !== 1 ? "s" : ""} generated so far.
        </p>
      )}
    </div>
  );
}

// ─── Page wrapper ────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-bg-elevated mb-5" />)}
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
