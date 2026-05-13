import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "CopyForge is an AI-powered writing platform designed for creators, marketers, and bloggers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="font-serif text-3xl text-text-heading sm:text-4xl">About CopyForge</h1>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-text-body">
        <p className="text-base">
          CopyForge is an AI-powered writing platform designed for creators, marketers, and bloggers.
        </p>

        <p>
          We believe that great content should not take hours to produce. With CopyForge, you can
          turn any idea into a polished blog post, news article, e-commerce copy, or academic piece
          in under 30 seconds — no learning curve required.
        </p>

        <p>
          Powered by DeepSeek v4 Flash, our platform delivers high-quality, SEO-optimized content
          that helps you grow your audience, rank higher in search, and save hours of writing time.
        </p>

        <p>
          Whether you are a solo blogger, a marketing team, or an entrepreneur launching a new
          product, CopyForge gives you the tools to create content at the speed of AI.
        </p>
      </div>
    </div>
  );
}
