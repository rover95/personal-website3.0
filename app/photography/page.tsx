"use client";

import dynamic from "next/dynamic";

const GalleryExperience = dynamic(() => import("@/components/GalleryExperience"), {
  ssr: false,
  loading: () => (
    <div className="gallery-canvas grid place-items-center rounded-[2rem] text-[#f0eadc]">
      正在加载 3D 画廊...
    </div>
  ),
});

export default function PhotographyPage() {
  return (
    <main className="min-h-screen bg-[#06080c] p-3 pt-24 text-[#f0eadc] sm:p-4 sm:pt-24">
      <section className="relative mx-auto h-[calc(100vh-7rem)] w-full">
        <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-black/45 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-[#72d7d8]">PHOTOGRAPHY ROOM</p>
            <h1 className="mt-2 font-[var(--font-display)] text-3xl font-bold leading-none tracking-[-0.04em] sm:text-4xl">
              3D 摄影画廊
            </h1>
          </div>
          <div className="mt-3 text-xs leading-6 text-[#f0eadc]/70 sm:text-sm">
            使用 W/A/S/D 移动，按住鼠标左键拖动视角，点击照片可放大查看。当前空间已按参考图布置
            21 个展品点位。
          </div>
        </div>
        <GalleryExperience />
      </section>
    </main>
  );
}
