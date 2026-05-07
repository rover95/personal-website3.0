"use client";

import { useEffect, useRef, useState } from "react";

const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 300;
const INITIAL_TOP = 200;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FrostedGlassPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const dragStartRef = useRef({
    pointerId: -1,
    pointerX: 0,
    pointerY: 0,
    panelX: 0,
    panelY: 0,
  });
  const [position, setPosition] = useState({ x: 0, y: INITIAL_TOP });

  useEffect(() => {
    setPosition({
      x: Math.max((window.innerWidth - PANEL_WIDTH) / 2, 0),
      y: Math.min(INITIAL_TOP, Math.max(window.innerHeight - PANEL_HEIGHT, 0)),
    });
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      panelX: position.x,
      panelY: position.y,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const dragStart = dragStartRef.current;

    if (dragStart.pointerId !== event.pointerId) {
      return;
    }

    const maxX = Math.max(window.innerWidth - PANEL_WIDTH, 0);
    const maxY = Math.max(window.innerHeight - PANEL_HEIGHT, 0);

    setPosition({
      x: clamp(dragStart.panelX + event.clientX - dragStart.pointerX, 0, maxX),
      y: clamp(dragStart.panelY + event.clientY - dragStart.pointerY, 0, maxY),
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (dragStartRef.current.pointerId !== event.pointerId) {
      return;
    }

    dragStartRef.current.pointerId = -1;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <aside
      ref={panelRef}
      className="frosted-glass-panel"
      aria-label="Frosted glass panel"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg className="electric-border-svg" aria-hidden="true" focusable="false">
        <defs>
          <filter id="home-electric-border" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="8" result="noiseA" seed="1" />
            <feOffset in="noiseA" dx="0" dy="0" result="offsetA">
              <animate attributeName="dy" values="520;0" dur="5.5s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="8" result="noiseB" seed="1" />
            <feOffset in="noiseB" dx="0" dy="0" result="offsetB">
              <animate attributeName="dy" values="0;-520" dur="5.5s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noiseC" seed="2" />
            <feOffset in="noiseC" dx="0" dy="0" result="offsetC">
              <animate attributeName="dx" values="360;0" dur="5.5s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noiseD" seed="2" />
            <feOffset in="noiseD" dx="0" dy="0" result="offsetD">
              <animate attributeName="dx" values="0;-360" dur="5.5s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feComposite in="offsetA" in2="offsetB" result="verticalNoise" />
            <feComposite in="offsetC" in2="offsetD" result="horizontalNoise" />
            <feBlend in="verticalNoise" in2="horizontalNoise" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="24" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <span className="electric-border-shadow" aria-hidden="true" />
      <span className="electric-border-soft" aria-hidden="true" />
      <span className="electric-border-stroke" aria-hidden="true" />
      <div className="frosted-glass-panel-inner">
        <p>FROSTED</p>
        <h2>Glass Panel</h2>
      </div>
    </aside>
  );
}
