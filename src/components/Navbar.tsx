"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const loading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 border-b border-border-light bg-bg-base/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal to-accent-copper text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            CF
          </div>
          <span className="text-lg font-serif font-bold tracking-tight text-text-heading">
            CopyForge
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          <NavLink href="/#pricing">Pricing</NavLink>

          <div className="mx-3 h-4 w-px bg-border-light" />

          <ThemeToggle />

          {loading ? (
            <div className="ml-3 h-8 w-20 animate-pulse rounded-md bg-bg-elevated" />
          ) : session?.user ? (
            <div className="ml-3 flex items-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-heading"
              >
                Dashboard
              </Link>
              <div className="group relative">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-8 w-8 rounded-full border border-border-light object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-accent-teal to-accent-copper text-xs font-bold text-white">
                    {session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="invisible absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-border-light bg-bg-surface p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  <div className="border-b border-border-light px-3 py-2 text-xs text-text-muted">
                    {session.user.email}
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-body hover:bg-bg-elevated"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-accent-copper hover:bg-accent-copper-bg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              <button
                onClick={() => signIn()}
                className="rounded-md px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-heading"
              >
                Log in
              </button>
              <Link
                href="/signup"
                className="rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-text-muted hover:bg-bg-elevated sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border-light bg-bg-surface px-5 pb-5 pt-3 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-text-body hover:bg-bg-elevated">
              Pricing
            </Link>
            <div className="flex items-center justify-between rounded-md px-3 py-2.5">
              <span className="text-sm text-text-body">Theme</span>
              <ThemeToggle />
            </div>
            {session?.user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-text-body hover:bg-bg-elevated">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className="rounded-md px-3 py-2.5 text-left text-sm text-accent-copper hover:bg-accent-copper-bg">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="rounded-md px-3 py-2.5 text-left text-sm text-text-body hover:bg-bg-elevated">
                  Log in
                </button>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-3 py-2.5 text-center text-sm font-medium text-white">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-heading"
    >
      {children}
    </Link>
  );
}
