import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const chinese = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-chinese",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Personal Website 3.0",
  description: "A cinematic personal website built with Next.js, React Three Fiber, Drei, GSAP and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${sans.variable} ${chinese.variable}`}>
        <div className="site-shell">
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  );
}
