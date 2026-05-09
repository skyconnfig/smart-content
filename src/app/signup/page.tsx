"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  if (isLoading || user) return null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal to-accent-copper shadow-sm">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="mt-5 font-serif text-2xl text-text-heading">Create your account</h1>
          <p className="mt-1 text-sm text-text-muted">Start generating AI content in seconds</p>
        </div>

        {/* Perks */}
        <div className="mt-8 rounded-lg border border-border-light bg-bg-surface p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">What you get</p>
          <ul className="mt-4 space-y-2.5">
            {[
              "2 free credits — no credit card",
              "All 4 writing styles",
              "Copy & paste your results",
              "Upgrade anytime via Creem",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-text-body">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth0 signup */}
        <div className="mt-6 space-y-3">
          <a
            href="/auth/login?screen_hint=signup"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border-light bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-body shadow-sm transition-all hover:bg-bg-elevated"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.98 7.448 12 14.265 2.02 7.448C2.182 5.242 4.056 3.5 6.33 3.5h11.34c2.274 0 4.148 1.742 4.31 3.948zM12 16.5c-.285 0-.57-.07-.825-.21L2 9.915V17.5c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V9.915l-9.175 6.375c-.255.14-.54.21-.825.21z" />
            </svg>
            Sign up with Auth0
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-text-dim">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent-teal hover:text-accent-teal-hover">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-text-dim">
          By signing up, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
