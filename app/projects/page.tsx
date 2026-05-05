import { AnimatedLanding } from "@/components/AnimatedLanding";

const projects = [
  "Immersive Portfolio Engine",
  "Realtime Visual Notes",
  "Photo Archive Index",
  "Interface Motion Lab",
];

export default function ProjectsPage() {
  return (
    <AnimatedLanding>
      <div className="noise-layer" />
      <section className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-36 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="reveal-up mb-5 text-sm font-bold tracking-[0.35em] text-[#335f4a]">PROJECTS</p>
            <h1 className="reveal-up font-[var(--font-display)] text-6xl font-bold leading-none tracking-[-0.045em] sm:text-8xl">
              项目页面用于承载作品、实验和工程记录。
            </h1>
          </div>
          <p className="reveal-up text-lg leading-8 text-[#11100c]/70">
            当前先放入项目列表骨架，后续可以替换为真实项目封面、GitHub 链接、技术说明、案例复盘和可交互 Demo。
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project}
              className="reveal-up group min-h-64 overflow-hidden rounded-[2rem] border border-black/10 bg-[#11100c] p-7 text-[#f0eadc] shadow-[0_24px_70px_rgba(17,16,12,0.22)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-display)] text-5xl text-[#ff5d2a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold tracking-[0.22em] text-[#72d7d8]">
                  CASE
                </span>
              </div>
              <h2 className="mt-16 text-3xl font-bold">{project}</h2>
              <p className="mt-4 max-w-xl leading-7 text-[#f0eadc]/65">
                预留项目卡片结构，支持后续扩展封面图、技术标签、详情页和外部链接。
              </p>
            </article>
          ))}
        </div>
      </section>
    </AnimatedLanding>
  );
}
