import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

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
  title: "CopyForge — AI-Powered Content Studio",
  description:
    "Turn any idea into a polished blog post, news article, e-commerce copy, or academic piece in seconds. No learning curve—just type and generate.",
  keywords: ["AI writing", "content generator", "blog writer", "copywriting"],
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
      </head>
      {/* Grain overlay is applied via CSS class "grain" — we add it here once */}
      <body className="flex min-h-full flex-col bg-bg-base text-text-body grain">
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border-light py-10 text-center text-xs text-text-dim">
              <p>&copy; {new Date().getFullYear()} CopyForge. All rights reserved.</p>
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
