import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CopyForge terms of service — rules and guidelines for using our AI content generation platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="font-serif text-3xl text-text-heading sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-text-dim">Last updated: May 12, 2026</p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-text-body">
        <p>
          By using CopyForge, you agree to use the platform responsibly and in accordance with these terms.
        </p>

        <p>
          Users may not use generated content for illegal, harmful, or abusive purposes.
          You retain ownership of the content you create, but you are responsible for how it is used.
        </p>

        <p>
          Pricing, features, and available credits may change at any time. Purchased credits are non-refundable
          except as required by applicable law.
        </p>

        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage in
          abusive behavior toward the platform or its users.
        </p>

        <p className="mt-6">
          Contact: <a href="mailto:support@lxs.best" className="text-accent-teal hover:underline">support@lxs.best</a>
        </p>
      </div>
    </div>
  );
}
