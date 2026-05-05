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
    <main className="min-h-screen bg-[#06080c] px-4 pb-8 pt-28 text-[#f0eadc] sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-[#72d7d8]">PHOTOGRAPHY ROOM</p>
            <h1 className="mt-3 font-[var(--font-display)] text-5xl font-bold leading-none tracking-[-0.04em] sm:text-7xl">
              3D 摄影画廊
            </h1>
          </div>
          <div className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-sm leading-7 text-[#f0eadc]/70 backdrop-blur">
            点击画廊左上角按钮进入鼠标锁定视角。使用 W/A/S/D 移动，鼠标环顾，Esc 退出。当前空间已按参考图布置
            21 个展品点位，可替换为真实摄影纹理。
          </div>
        </div>
        <GalleryExperience />
      </section>
    </main>
  );
}
