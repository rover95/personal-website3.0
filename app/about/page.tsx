import { AnimatedLanding } from "@/components/AnimatedLanding";

export default function AboutPage() {
  return (
    <AnimatedLanding>
      <div className="noise-layer" />
      <section className="relative z-10 mx-auto min-h-screen max-w-6xl px-6 pb-20 pt-36 sm:px-10">
        <p className="reveal-up mb-5 text-sm font-bold tracking-[0.35em] text-[#335f4a]">ABOUT</p>
        <h1 className="reveal-up max-w-4xl font-[var(--font-display)] text-6xl font-bold leading-none tracking-[-0.045em] sm:text-8xl">
          简介页已经接入路由，可以继续扩展履历、技能和个人叙事。
        </h1>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal-up rounded-[2rem] bg-[#11100c] p-8 text-[#f0eadc]">
            <p className="text-sm font-semibold tracking-[0.28em] text-[#72d7d8]">PROFILE SIGNAL</p>
            <p className="mt-16 font-[var(--font-display)] text-6xl font-bold text-[#ff5d2a]">03</p>
            <p className="mt-4 text-lg leading-8 text-[#f0eadc]/75">
              第三个版本聚焦更强的视觉记忆点：内容结构清晰，但交互和动效更有现场感。
            </p>
          </div>
          <div className="reveal-up rounded-[2rem] border border-black/10 bg-white/35 p-8 backdrop-blur">
            <p className="text-lg leading-9 text-[#11100c]/72">
              这里是个人简介的占位内容。后续可以放入真实经历、技能栈、工作方式、摄影风格说明，以及社交链接。
              目前框架已经把页面路由、导航高亮、入场动效和响应式布局搭好，便于直接替换为正式文案。
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Frontend", "Creative Code", "Photography"].map((item) => (
                <div key={item} className="rounded-2xl bg-[#f7f0df]/80 p-5">
                  <p className="text-sm font-bold tracking-[0.2em] text-[#11100c]/45">FIELD</p>
                  <p className="mt-4 text-xl font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedLanding>
  );
}
