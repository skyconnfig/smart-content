"use client";

import { type KeyboardEvent } from "react";

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function KeywordInput({ value, onChange, onSubmit, disabled }: KeywordInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg className="h-4 w-4 text-text-dim" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Enter a topic, keyword, or idea..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-full rounded-lg border border-border-light bg-bg-surface py-3.5 pl-11 pr-4 text-sm text-text-body placeholder-text-dim shadow-sm transition-all focus:border-accent-teal focus:outline-none focus:ring-2 focus:ring-accent-teal/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
