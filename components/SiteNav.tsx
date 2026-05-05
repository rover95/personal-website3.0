"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "简介" },
  { href: "/photography", label: "摄影" },
  { href: "/projects", label: "项目" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/10 bg-[#f7f0df]/75 px-4 py-3 shadow-[0_18px_50px_rgba(17,16,12,0.12)] backdrop-blur-xl">
        <Link href="/" className="font-[var(--font-display)] text-2xl font-bold tracking-tight">
          SWIRL/03
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-black/[0.04] p-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-[#11100c] text-[#f0eadc]" : "text-[#11100c]/70 hover:bg-white/60 hover:text-[#11100c]"
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
