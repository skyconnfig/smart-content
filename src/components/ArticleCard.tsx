"use client";

interface ArticleCardProps {
  title: string;
  template: string;
  createdAt: string;
  preview: string;
}

const TEMPLATE_BADGES: Record<string, { label: string; classes: string }> = {
  blog:       { label: "Blog",       classes: "border-accent-teal/20 text-accent-teal bg-accent-teal-bg" },
  news:       { label: "News",       classes: "border-accent-copper/20 text-accent-copper bg-accent-copper-bg" },
  ecommerce:  { label: "E‑commerce", classes: "border-accent-teal/20 text-accent-teal bg-accent-teal-bg" },
  academic:   { label: "Academic",   classes: "border-accent-copper/20 text-accent-copper bg-accent-copper-bg" },
};

export default function ArticleCard({ title, template, createdAt, preview }: ArticleCardProps) {
  const badge = TEMPLATE_BADGES[template] || { label: template, classes: "border-border-light text-text-muted bg-bg-elevated" };
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group rounded-lg border border-border-light bg-bg-surface p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex-1 text-sm font-semibold text-text-heading truncate">
          {title}
        </h3>
        <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-muted line-clamp-3">
        {preview}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3">
        <span className="text-xs text-text-dim">{date}</span>
        <span className="text-xs font-medium text-accent-teal opacity-0 transition-opacity group-hover:opacity-100">
          View &rarr;
        </span>
      </div>
    </div>
  );
}
