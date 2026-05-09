"use client";

import { useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import KeywordInput from "@/components/KeywordInput";
import TemplateSelect from "@/components/TemplateSelect";
import ResultDisplay from "@/components/ResultDisplay";
import PurchaseButton from "@/components/PurchaseButton";
import type { TemplateStyle } from "@/types";

export default function Home() {
  const { data: session } = useSession();
  const [keyword, setKeyword] = useState("");
  const [template, setTemplate] = useState<TemplateStyle>("blog");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPurchase, setNeedsPurchase] = useState(false);
  const [remainingFree, setRemainingFree] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!session?.user?.email) { signIn(); return; }
    if (!keyword.trim()) { setError("Enter a topic to get started."); return; }

    setIsLoading(true);
    setError(null);
    setNeedsPurchase(false);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim(), template }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsPurchase) setNeedsPurchase(true);
        throw new Error(data.error || "Generation failed");
      }
      setResult(data.content);
      setRemainingFree(data.remainingFree);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [keyword, template, session]);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ===== HERO ===== */}
      <section className="relative grid gap-12 pt-20 pb-24 sm:grid-cols-2 sm:pt-28 sm:pb-32 sm:items-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -top-40 left-1/2 h-[32rem] w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-teal/8 via-accent-copper/4 to-transparent blur-3xl sm:left-auto sm:right-0 sm:translate-x-0" />

        {/* Left: text */}
        <div className="relative animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-elevated/50 px-4 py-1.5 text-xs font-medium text-text-muted">
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent-teal" />
            Powered by DeepSeek &bull; v4 Flash
          </div>

          <h1 className="font-serif text-4xl leading-tight tracking-tight text-text-heading sm:text-5xl lg:text-6xl">
            Write better.
            <br />
            <span className="bg-gradient-to-r from-accent-teal to-accent-copper bg-clip-text text-transparent">
              Faster.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-text-body sm:text-lg">
            Turn any idea into a polished blog post, news article,
            e-commerce copy, or academic piece. No learning curve—just type and generate.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
            >
              Try It Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-md border border-border-light px-5 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated"
            >
              How It Works
            </a>
          </div>

          {/* Micro stats */}
          <div className="mt-10 flex items-center gap-6 text-xs text-text-dim">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-text-body">4</span> styles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-text-body">2</span> free trials
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-text-body">1</span> click generate
            </span>
          </div>
        </div>

        {/* Right: visual */}
        <div className="relative hidden sm:block animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
            {/* Decorative card stack */}
            <div className="absolute right-4 top-4 h-full w-full rounded-2xl border border-border-light bg-bg-elevated/50" />
            <div className="absolute right-2 top-2 h-full w-full rounded-2xl border border-border-light bg-bg-surface shadow-sm" />
            <div className="relative flex h-full w-full flex-col justify-between rounded-2xl border border-border-light bg-bg-surface p-7 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="flex h-2 w-2 rounded-full bg-accent-teal" />
                Ready to generate
              </div>
              <div className="space-y-3">
                <div className="h-2.5 w-3/4 rounded bg-bg-elevated" />
                <div className="h-2.5 w-1/2 rounded bg-bg-elevated" />
                <div className="mt-5 h-20 rounded-lg border border-border-light bg-bg-base p-3">
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-bg-elevated" />
                    <div className="h-2 w-5/6 rounded bg-bg-elevated" />
                    <div className="h-2 w-2/3 rounded bg-bg-elevated" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-text-dim">
                <span className="flex h-1 w-1 rounded-full bg-accent-copper" />
                AI-generated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GENERATOR TOOL ===== */}
      <section id="generator" className="mx-auto max-w-3xl scroll-mt-24">
        <div className="rounded-2xl border border-border-light bg-bg-surface p-7 shadow-sm sm:p-9">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-heading">
              What do you want to write about?
            </label>
            <KeywordInput value={keyword} onChange={setKeyword} onSubmit={handleGenerate} disabled={isLoading} />
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-text-heading">Content Style</label>
            <TemplateSelect value={template} onChange={setTemplate} disabled={isLoading} />
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {session?.user ? (
                <span>Credits: <span className="font-medium text-text-body">{remainingFree ?? "—"} remaining</span></span>
              ) : (
                <span>Sign in to get started</span>
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : "Generate Content"}
            </button>
          </div>

          <ResultDisplay
            content={result}
            isLoading={isLoading}
            error={error}
            needsPurchase={needsPurchase}
            onDismiss={() => { setResult(null); setError(null); setNeedsPurchase(false); }}
          />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="scroll-mt-24 py-28">
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-text-muted">Simple Workflow</p>
          <h2 className="font-serif text-3xl text-text-heading sm:text-4xl">Three steps, one result</h2>
          <p className="mt-3 text-text-muted max-w-md mx-auto">From idea to content in under 30 seconds.</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 stagger">
          {[
            { num: "01", title: "Enter your topic", desc: "Type in a keyword, phrase, or idea. The more specific, the better the output." },
            { num: "02", title: "Choose a style", desc: "Pick from blog, news, e-commerce, or academic. Each template is fine-tuned for its purpose." },
            { num: "03", title: "Generate & use", desc: "Click generate and get your content instantly. Copy, edit, or export—it's yours." },
          ].map((s) => (
            <div key={s.num} className="group animate-fade-in-up">
              <span className="font-serif text-5xl text-accent-teal/20 dark:text-accent-teal/15 group-hover:text-accent-teal/40 transition-colors">
                {s.num}
              </span>
              <h3 className="mt-3 font-serif text-xl text-text-heading">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <div className="mt-5 h-px w-12 bg-border-light group-hover:w-20 group-hover:bg-accent-teal/40 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== TEMPLATE STYLES ===== */}
      <section className="py-20 border-t border-border-light">
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-text-muted">Templates</p>
          <h2 className="font-serif text-3xl text-text-heading sm:text-4xl">Four purpose-built styles</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger">
          {[
            { title: "Blog Post", desc: "Engaging, well-structured articles perfect for your blog or Medium. Smooth narrative flow.", icon: "✎" },
            { title: "News Article", desc: "Concise, factual writing with the inverted pyramid structure. Great for press releases.", icon: "⚡" },
            { title: "E‑commerce", desc: "Persuasive product copy that drives conversions. Focused on benefits and features.", icon: "◈" },
            { title: "Academic", desc: "Formal, research-oriented writing for papers, essays, and educational content.", icon: "◇" },
          ].map((t) => (
            <div key={t.title} className="group animate-fade-in-up rounded-xl border border-border-light bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md">
              <span className="text-2xl text-accent-teal">{t.icon}</span>
              <h3 className="mt-4 font-serif text-lg text-text-heading">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="scroll-mt-24 py-24">
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-text-muted">Pricing</p>
          <h2 className="font-serif text-3xl text-text-heading sm:text-4xl">Start free, scale when you need</h2>
          <p className="mt-3 text-text-muted">No subscription. No hidden fees. Just credits that last.</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3 stagger">
          {/* ── Free ── */}
          <div className="animate-fade-in-up rounded-xl border border-border-light bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md flex flex-col">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">Free</p>
              <h3 className="sr-only">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl text-text-heading">$0</span>
                <span className="text-xs text-text-dim">/ forever</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">Perfect for trying it out</p>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "2 AI content generations",
                  "Blog, SEO & social templates",
                  "Copy to clipboard",
                  "No credit card required",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-8">
              <Link
                href={session?.user ? "#generator" : "/signup"}
                className="flex w-full items-center justify-center rounded-md border border-border-light px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated"
              >
                {session?.user ? "Start Writing" : "Create Free Account"}
              </Link>
            </div>
          </div>

          {/* ── Creator ⭐ ── */}
          <div className="animate-fade-in-up relative rounded-xl border-2 border-accent-teal/60 bg-bg-surface p-6 shadow-lg transition-all hover:shadow-xl flex flex-col" style={{ animationDelay: "80ms" }}>
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-b from-accent-teal/10 via-transparent to-accent-copper/5 blur-xl opacity-80" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-1 text-xs font-semibold text-white shadow-sm">
              ⭐ Most Popular
            </div>
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-accent-copper">⭐ Creator</p>
              <h3 className="sr-only">Creator</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl text-text-heading">$4.99</span>
                <span className="text-xs text-text-dim">/ one-time</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">Best value for regular creators</p>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "30 AI content generations",
                  "All template styles",
                  "SEO-optimized content",
                  "E-commerce & social copy",
                  "History & export",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-auto pt-8">
              {session?.user ? (
                <PurchaseButton email={session.user.email!} tier="creator" credits={30} price="4.99" label="Get 30 Credits — $4.99" />
              ) : (
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* ── Pro ── */}
          <div className="animate-fade-in-up rounded-xl border border-border-light bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md flex flex-col" style={{ animationDelay: "160ms" }}>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">Pro</p>
              <h3 className="sr-only">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl text-text-heading">$12.99</span>
                <span className="text-xs text-text-dim">/ one-time</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">For power users and teams</p>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "200 AI content generations",
                  "Long-form article generation",
                  "Advanced SEO optimization",
                  "Batch generation",
                  "Content export (PDF, Markdown)",
                  "Priority generation speed",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-8">
              {session?.user ? (
                <PurchaseButton email={session.user.email!} tier="pro" credits={200} price="12.99" label="Get 200 Credits — $12.99" />
              ) : (
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-md border border-border-light px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-28">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-teal to-accent-copper px-8 py-16 text-center sm:px-16">
          {/* Pattern overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="relative">
            <h2 className="font-serif text-3xl text-white sm:text-4xl">Ready to create something great?</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80">
              Join thousands of writers, marketers, and entrepreneurs using CopyForge to produce content at the speed of AI.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              {session?.user ? (
                <a href="#generator" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-accent-teal shadow-sm transition-all hover:bg-white/90">
                  Generate Content Now
                </a>
              ) : (
                <>
                  <Link href="/signup" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-accent-teal shadow-sm transition-all hover:bg-white/90">
                    Get Started Free
                  </Link>
                  <button onClick={() => signIn()} className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
