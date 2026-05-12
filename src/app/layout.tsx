import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const baseUrl = "https://ai.lxs.best";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CopyForge — AI-Powered Content Studio",
    template: "%s — CopyForge",
  },
  description:
    "Turn any idea into a polished blog post, news article, e-commerce copy, or academic piece in seconds. No learning curve—just type and generate.",
  keywords: ["AI writing", "content generator", "blog writer", "copywriting"],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "CopyForge — AI-Powered Content Studio",
    description:
      "Turn any idea into a polished blog post, news article, e-commerce copy, or academic piece in seconds.",
    url: baseUrl,
    siteName: "CopyForge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CopyForge — AI-Powered Content Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CopyForge — AI-Powered Content Studio",
    description:
      "Turn any idea into a polished blog post, news article, e-commerce copy, or academic piece in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme');
                  var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CopyForge",
              url: baseUrl,
              description:
                "AI-powered content generator for blog posts, news articles, e-commerce copy, and academic writing.",
              applicationCategory: "Multimedia",
              operatingSystem: "Web",
              offers: [
                {
                  "@type": "Offer",
                  name: "Free",
                  price: "0",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Creator",
                  price: "4.99",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Pro",
                  price: "12.99",
                  priceCurrency: "USD",
                },
              ],
              author: {
                "@type": "Organization",
                name: "CopyForge",
              },
            }),
          }}
        />
      </head>
      {/* Grain overlay is applied via CSS class "grain" — we add it here once */}
      <body className="flex min-h-full flex-col bg-bg-base text-text-body grain">
        <SessionProvider>
          <ThemeProvider>
            <GoogleAnalytics />
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border-light py-10 text-center text-xs text-text-dim">
              <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <nav className="mb-3 flex items-center justify-center gap-4">
                  <a href="/privacy" className="transition-colors hover:text-text-body">Privacy Policy</a>
                </nav>
                <p>&copy; {new Date().getFullYear()} CopyForge. All rights reserved.</p>
              </div>
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
