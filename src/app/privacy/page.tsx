import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CopyForge privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="font-serif text-3xl text-text-heading sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-dim">Last updated: May 12, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-body">
        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">Information We Collect</h2>
          <p>
            CopyForge respects your privacy and only collects necessary data to provide AI content
            generation services. We may collect email addresses, generated content, and usage analytics.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our AI content generation service.
            We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">Contact</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:support@lxs.best" className="text-accent-teal hover:underline">support@lxs.best</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
