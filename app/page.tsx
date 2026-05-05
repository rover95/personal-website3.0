import Link from "next/link";
import { AnimatedLanding } from "@/components/AnimatedLanding";

const cards = [
  {
    label: "简介",
    href: "/about",
    title: "把技术、影像和个人表达装进同一个界面。",
    accent: "from-[#ff5d2a] to-[#f6bf3f]",
  },
  {
    label: "摄影",
    href: "/photography",
    title: "进入可漫游的 3D 画廊，像逛展一样浏览作品。",
    accent: "from-[#72d7d8] to-[#335f4a]",
  },
  {
    label: "项目",
    href: "/projects",
    title: "整理产品实验、前端工程和可视化项目。",
    accent: "from-[#11100c] to-[#5d4a31]",
  },
];

export default function Home() {
  return (
    <AnimatedLanding>
      <div className="noise-layer" />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="reveal-up mb-5 inline-flex rounded-full border border-black/10 bg-white/35 px-4 py-2 text-sm font-semibold tracking-[0.32em] text-[#335f4a] backdrop-blur">
              PERSONAL WEBSITE 3.0
            </p>
            <h1 className="reveal-up max-w-4xl font-[var(--font-display)] text-7xl font-bold leading-[0.86] tracking-[-0.06em] text-[#11100c] sm:text-8xl lg:text-[10rem]">
              build
              <span className="block text-[#ff5d2a]">with</span>
              texture.
            </h1>
            <p className="reveal-up mt-8 max-w-2xl text-lg leading-8 text-[#11100c]/72">
              一个面向 Vercel 部署的个人网站框架：Next.js 负责内容和路由，React Three Fiber
              承载沉浸式摄影空间，GSAP 和 Tailwind 负责动效与视觉节奏。
            </p>
            <div className="reveal-up mt-10 flex flex-wrap gap-4">
              <Link
                href="/photography"
                className="rounded-full bg-[#11100c] px-6 py-3 text-sm font-bold text-[#f0eadc] shadow-[0_18px_40px_rgba(17,16,12,0.25)] transition hover:-translate-y-1 hover:bg-[#ff5d2a]"
              >
                进入 3D 画廊
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-[#11100c]/20 bg-white/35 px-6 py-3 text-sm font-bold text-[#11100c] backdrop-blur transition hover:-translate-y-1 hover:bg-white/70"
              >
                查看项目
              </Link>
            </div>
          </div>

          <div className="reveal-up relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-white/35 bg-[#11100c] p-6 text-[#f0eadc] shadow-[0_32px_90px_rgba(17,16,12,0.35)]">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#72d7d8]/35 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ff5d2a]/35 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <p className="text-sm font-semibold tracking-[0.28em] text-[#72d7d8]">CURRENT STACK</p>
              <div className="space-y-5">
                {["Next.js App Router", "React Three Fiber + Drei", "GSAP reveal system", "Tailwind visual layer"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-4 border-t border-white/12 pt-4">
                      <span className="font-[var(--font-display)] text-4xl text-[#ff5d2a]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg font-semibold">{item}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="reveal-up group overflow-hidden rounded-[2rem] border border-black/10 bg-white/30 p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/55"
            >
              <div className={`mb-10 h-2 w-28 rounded-full bg-gradient-to-r ${card.accent}`} />
              <p className="mb-3 text-sm font-bold tracking-[0.3em] text-[#11100c]/50">{card.label}</p>
              <h2 className="text-2xl font-bold leading-tight text-[#11100c]">{card.title}</h2>
              <span className="mt-8 inline-block text-sm font-bold text-[#ff5d2a] transition group-hover:translate-x-2">
                打开页面
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AnimatedLanding>
  );
}
