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
          <h2 className="mb-3 font-serif text-xl text-text-heading">1. Information We Collect</h2>
          <p>
            When you sign in to CopyForge, we collect your email address and display name from your chosen
            authentication provider (Google, GitHub, or Auth0). We also collect the content topics you
            input and the generated content you produce.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">2. How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our AI content generation service, process
            payments via Creem, and send service-related communications. We do not sell your personal
            data to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">3. Data Storage & Security</h2>
          <p>
            Your data is stored securely on Neon PostgreSQL servers. We use industry-standard encryption
            for data in transit and at rest. Generated content is stored only as long as your account is
            active.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Auth0 / GitHub / Google</strong> — Authentication</li>
            <li><strong>Creem</strong> — Payment processing</li>
            <li><strong>Neon</strong> — Database hosting</li>
            <li><strong>Vercel</strong> — Application hosting</li>
            <li><strong>DeepSeek</strong> — AI content generation</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">5. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any time by
            contacting us. You can also delete your generated content from your dashboard.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-text-heading">6. Contact</h2>
          <p>
            For privacy-related inquiries, please reach out through the contact information provided on
            our website.
          </p>
        </section>
      </div>
    </div>
  );
}
