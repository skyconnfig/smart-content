"use client";

import { useState } from "react";

interface ResultDisplayProps {
  content: string | null;
  isLoading: boolean;
  error: string | null;
  needsPurchase: boolean;
  onDismiss: () => void;
}

export default function ResultDisplay({
  content,
  isLoading,
  error,
  needsPurchase,
  onDismiss,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!content && !isLoading && !error) return null;

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border-light bg-bg-surface shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-light px-5 py-3.5">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {isLoading ? "Generating..." : content ? "Result" : "Notice"}
        </p>
        {content && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-elevated"
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5 text-accent-teal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-dim transition-colors hover:bg-bg-elevated hover:text-text-muted"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded bg-bg-elevated animate-pulse" />
            <div className="h-3 w-full rounded bg-bg-elevated animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-bg-elevated animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-bg-elevated animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-bg-elevated animate-pulse" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className={`rounded-lg border p-4 ${needsPurchase ? "border-accent-copper/20 bg-accent-copper-bg" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"}`}>
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-1.5 ${needsPurchase ? "text-accent-copper" : "text-red-500"}`}>
                {needsPurchase ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${needsPurchase ? "text-accent-copper" : "text-red-600 dark:text-red-400"}`}>
                  {needsPurchase ? "Out of Credits" : "Generation Failed"}
                </p>
                <p className={`mt-1 text-sm ${needsPurchase ? "text-text-muted" : "text-red-500 dark:text-red-400/80"}`}>
                  {error}
                </p>
                {needsPurchase && (
                  <a
                    href="/dashboard?purchase=1"
                    className="mt-3 inline-flex items-center rounded-md bg-gradient-to-r from-accent-teal to-accent-copper px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                  >
                    Buy Credits &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="prose prose-sm max-w-none">
            {content.split("\n").map((paragraph, i) => (
              paragraph.trim() ? (
                <p key={i} className="mb-3 leading-relaxed text-text-body text-[15px]">
                  {paragraph}
                </p>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
