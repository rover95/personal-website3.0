"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "简介" },
  { href: "/photography", label: "摄影" },
  { href: "/projects", label: "项目" },
];

const frostedStyle = {
  WebkitBackdropFilter: "blur(30px) saturate(1.8) contrast(1.08)",
  backdropFilter: "blur(30px) saturate(1.8) contrast(1.08)",
} satisfies CSSProperties;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-8 sm:px-8">
      <nav className="site-nav-frosted relative flex w-[min(72rem,calc(100vw-3rem))] items-center justify-between overflow-hidden rounded-full px-4 py-3 text-white" style={frostedStyle}>
        <Link href="/" className="font-[var(--font-display)] text-2xl font-bold tracking-tight">
          SWIRL/03
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-white/[0.12] p-1 shadow-inner shadow-white/15">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-white/80 text-[#071018] shadow-[0_8px_24px_rgba(255,255,255,0.22)]" : "text-white/78 hover:bg-white/22 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
