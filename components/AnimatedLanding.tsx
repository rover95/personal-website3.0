"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function AnimatedLanding({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".reveal-up", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope },
  );

  return <main ref={scope}>{children}</main>;
}
