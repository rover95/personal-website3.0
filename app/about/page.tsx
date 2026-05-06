import Image from "next/image";
import { AnimatedLanding } from "@/components/AnimatedLanding";

const galleryImages = [
  "/photography/previews/DSC_2667.webp",
  "/photography/previews/20230818-_DSC3796-编辑.webp",
  "/photography/previews/20230730-_DSC1504.webp",
  "/photography/previews/20230728-_DSC1070.webp",
  "/photography/previews/20230724-_DSC9815.webp",
  "/photography/previews/20230723-_DSC9675.webp",
];

export default function AboutPage() {
  return (
    <AnimatedLanding>
      <div className="noise-layer" />
      <section className="relative z-10 mx-auto min-h-screen max-w-6xl px-6 pb-28 pt-36 sm:px-10">
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
        <div className="mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal-up lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-bold tracking-[0.35em] text-[#335f4a]">VISUAL ARCHIVE</p>
            <h2 className="mt-5 font-[var(--font-display)] text-5xl font-bold leading-none tracking-[-0.04em] sm:text-7xl">
              一些项目里的影像，让页面有真实内容可以继续向下滚动。
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#11100c]/65">
              这些图片来自摄影项目的预览资源。后续可以替换成作品集、实验项目截图、现场记录或设计过程图。
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {galleryImages.map((src, index) => (
              <figure
                key={src}
                className={`reveal-up overflow-hidden rounded-[2rem] border border-black/10 bg-white/35 p-3 shadow-[0_24px_70px_rgba(17,16,12,0.16)] backdrop-blur ${
                  index % 2 === 1 ? "sm:translate-y-16" : ""
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-[#11100c]/10">
                  <Image
                    src={src}
                    alt={`简介页项目图片 ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 360px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between px-2 pt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#11100c]/45">
                  <span>Frame {String(index + 1).padStart(2, "0")}</span>
                  <span>Preview</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </AnimatedLanding>
  );
}
