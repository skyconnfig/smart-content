"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
          <h1 className="mt-5 font-serif text-2xl text-text-heading">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">Sign in to your CopyForge account</p>
        </div>

        {/* Auth0 login */}
        <div className="mt-8 space-y-3">
          <a
            href="/auth/login"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border-light bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-body shadow-sm transition-all hover:bg-bg-elevated"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.98 7.448 12 14.265 2.02 7.448C2.182 5.242 4.056 3.5 6.33 3.5h11.34c2.274 0 4.148 1.742 4.31 3.948zM12 16.5c-.285 0-.57-.07-.825-.21L2 9.915V17.5c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V9.915l-9.175 6.375c-.255.14-.54.21-.825.21z" />
            </svg>
            Continue with Auth0
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-text-dim">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent-teal hover:text-accent-teal-hover">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
