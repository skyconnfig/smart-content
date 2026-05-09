"use client";

import { TEMPLATE_OPTIONS, type TemplateStyle } from "@/types";

interface TemplateSelectProps {
  value: TemplateStyle;
  onChange: (value: TemplateStyle) => void;
  disabled?: boolean;
}

export default function TemplateSelect({ value, onChange, disabled }: TemplateSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATE_OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              active
                ? "border-accent-teal bg-accent-teal-bg text-accent-teal shadow-sm"
                : "border-border-light bg-bg-surface text-text-muted hover:border-border-medium hover:text-text-body"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
