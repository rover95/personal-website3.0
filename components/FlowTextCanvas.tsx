"use client";

import { useEffect, useRef } from "react";

const NATURAL_WIDTH = 1356;
const NATURAL_HEIGHT = 380;
const CIRCLES_PER_SEGMENT = 60;
const DPR_LIMIT = 1.5;
// M 233.2 905.7 C 424.6 739.3, 512.9 589.2, 587.5 426.0 C 598.2 389.5, 579.8 379.2, 552.0 383.0 C 520.0 390.5, 518.1 409.2, 519.3 429.3 C 520.3 446.6, 548.8 509.2, 587.0 521.0 C 631.6 527.7, 677.7 466.4, 706.0 503.0 C 726.6 524.5, 597.7 802.7, 690.0 813.0 C 776.5 831.7, 886.1 587.6, 918.2 548.7 C 952.4 505.2, 976.8 467.0, 1029.4 465.6 C 1101.6 464.2, 1125.8 497.6, 1135.1 552.2 C 1140.6 616.1, 1133.4 817.2, 1007.0 817.0 C 881.8 806.3, 913.7 622.3, 916.7 592.2 C 921.2 573.5, 919.9 554.9, 935.5 544.3 C 969.7 535.4, 960.3 634.7, 1112.2 638.0 C 1202.8 643.3, 1231.3 486.0, 1288.0 485.0 C 1331.1 479.2, 1254.7 819.0, 1333.0 829.0 C 1389.7 821.7, 1472.0 471.4, 1493.9 469.2 C 1510.3 471.2, 1515.8 590.5, 1576.0 643.0 C 1620.0 677.7, 1756.4 669.8, 1777.0 622.4 C 1799.3 555.0, 1750.1 472.7, 1671.0 485.0 C 1594.1 500.6, 1591.9 594.0, 1594.0 669.0 C 1602.5 749.6, 1626.1 824.8, 1698.1 827.4 C 1760.5 827.1, 1808.5 798.3, 1856.3 734.2 C 1895.0 697.2, 2036.7 448.6, 2099.2 337.8 C 2133.7 281.3, 2156.9 203.9, 2116.2 208.5 C 2015.1 225.1, 1838.1 806.7, 1946.6 816.2 C 2032.5 837.7, 2110.6 690.7, 2141.5 640.7 C 2171.7 588.6, 2188.7 568.4, 2206.9 550.5 C 2233.0 533.2, 2274.7 512.9, 2298.7 520.2 C 2278.8 528.4, 2236.4 519.9, 2188.3 575.8 C 2125.5 658.3, 2054.5 807.0, 2170.8 815.9 C 2273.2 825.5, 2336.1 553.6, 2317.4 534.8 C 2310.1 527.8, 2302.4 530.2, 2296.8 544.3 C 2285.8 562.0, 2248.4 828.0, 2350.1 816.8 C 2440.5 822.8, 2574.3 555.4, 2565.8 511.6 C 2564.7 484.8, 2534.8 494.1, 2522.3 529.2 C 2498.8 653.9, 2653.4 761.5, 2593.3 805.3 C 2566.2 822.8, 2530.6 817.2, 2502.3 804.3 C 2479.4 784.1, 2496.5 747.6, 2523.3 742.3 C 2590.0 727.1, 2614.3 758.0, 2671.3 740.3 C 2757.7 732.5, 2920.6 250.7, 2901.2 221.5 C 2899.5 201.5, 2866.0 199.4, 2858.6 231.6 C 2840.0 250.9, 2733.2 739.8, 2792.3 795.4 C 2843.0 843.0, 2928.7 810.3, 3008.2 737.9
const FLOW_STROKES = [
  {
    start: { x: 1182.9, y: 144.5 },
    segments: ["1244.0,136.6,1290.6,133.8,1326.0,131.9"],
  },
  {
    start: { x: 34, y: 354.7 },
    segments: [
      "123.3,277.1,164.4,207.1,199.2,131.0",
      "204.2,114.0,195.6,109.2,182.7,110.9",
      "167.7,114.4,166.9,123.2,167.4,132.5",
      "167.9,140.6,181.2,169.8,199.0,175.3",
      "219.8,178.4,241.3,149.8,254.5,166.9",
      "264.1,176.9,204.0,306.6,247.0,311.4",
      "287.3,320.2,338.5,206.3,353.4,188.2",
      "369.4,167.9,380.7,150.1,405.3,149.5",
      "438.9,148.8,450.2,164.4,454.6,189.8",
      "457.1,219.6,453.8,313.4,394.8,313.3",
      "336.4,308.3,351.3,222.5,352.7,208.5",
      "354.8,199.8,354.2,191.1,361.5,186.2",
      "377.4,182.0,373.1,228.3,443.9,229.8",
      "486.1,232.3,499.4,159.0,525.9,158.5",
      "546.0,155.8,510.3,314.2,546.8,318.9",
      "573.3,315.5,611.7,152.2,621.9,151.1",
      "629.5,152.1,632.1,207.7,660.2,232.2",
      "680.7,248.4,744.3,244.7,753.9,222.6",
      "764.3,191.1,741.3,152.8,704.5,158.5",
      "668.6,165.8,667.6,209.3,668.5,244.3",
      "672.5,281.9,683.5,317.0,717.1,318.2",
      "746.2,318.0,768.6,304.6,790.9,274.7",
      "808.9,257.5,875.0,141.5,904.1,89.9",
      "920.2,63.5,931.0,27.4,912.1,29.6",
      "864.9,37.3,782.4,308.5,833.0,312.9",
      "873.0,323.0,909.4,254.4,923.9,231.1",
      "937.9,206.8,945.9,197.4,954.3,189.0",
      "966.5,181.0,986.0,171.5,997.2,174.9",
      "987.9,178.7,968.1,174.8,945.7,200.8",
      "916.4,239.3,883.3,308.7,937.5,312.8",
      "985.3,317.3,1014.6,190.5,1005.9,181.7",
      "1002.5,178.5,998.9,179.6,996.3,186.2",
      "991.1,194.4,973.7,318.4,1021.1,313.2",
      "1063.3,316.0,1125.7,191.3,1121.7,170.9",
      "1121.2,158.4,1107.3,162.7,1101.4,179.1",
      "1090.5,237.3,1162.6,287.4,1134.5,307.9",
      "1121.9,316.0,1105.3,313.4,1092.1,307.4",
      "1081.4,298.0,1089.4,281.0,1101.9,278.5",
      "1133.0,271.4,1144.3,285.8,1170.9,277.5",
      "1211.2,273.9,1287.2,49.2,1278.1,35.6",
      "1277.3,26.3,1261.7,25.3,1258.2,40.3",
      "1249.6,49.3,1199.8,277.3,1227.3,303.2",
      "1251.0,325.4,1290.9,310.2,1328.0,276.4",
    ],
  },
];
const POINT_COUNT = FLOW_STROKES.reduce((total, stroke) => total + stroke.segments.length, 0);

type FlowPoint = {
  countX: number;
  countY: number;
  ecx: number;
  ecy: number;
  ex: number;
  ey: number;
  invert: number;
  startsStroke: boolean;
  scx: number;
  scy: number;
  sx: number;
  sy: number;
  wiggleX: number;
  wiggleY: number;
};

const colors = [
  { r: 255, g: 0, b: 100 },
  { r: 0, g: 105, b: 200 },
  { r: 0, g: 255, b: 120 },
  { r: 255, g: 255, b: 0 },
];

function cubicN(t: number, a: number, b: number, c: number, d: number) {
  const t2 = t * t;
  const t3 = t2 * t;

  return (
    a +
    (-a * 3 + t * (3 * a - a * t)) * t +
    (3 * b + t * (-6 * b + b * 3 * t)) * t +
    (c * 3 - c * 3 * t) * t2 +
    d * t3
  );
}

function wiggleLooper(value: number) {
  return Math.cos(value / 300) * 1.15;
}

function createPoints(scale: number, xAdjust: number): FlowPoint[] {
  return FLOW_STROKES.flatMap((stroke) =>
    stroke.segments.map((segment, index) => {
      const pointControllers = segment.split(",").map(Number);
      const previousControllers = index === 0 ? null : stroke.segments[index - 1].split(",").map(Number);

      return {
        scx: pointControllers[0] * scale + xAdjust,
        scy: pointControllers[1] * scale,
        ecx: pointControllers[2] * scale + xAdjust,
        ecy: pointControllers[3] * scale,
        ex: pointControllers[4] * scale + xAdjust,
        ey: pointControllers[5] * scale,
        countX: Math.round(Math.random() * 100),
        countY: Math.round(Math.random() * 100),
        invert: Math.random() > 0.5 ? 1 : -1,
        startsStroke: index === 0,
        sx: index === 0 ? stroke.start.x * scale + xAdjust : previousControllers![4] * scale + xAdjust,
        sy: index === 0 ? stroke.start.y * scale : previousControllers![5] * scale,
        wiggleX: 0,
        wiggleY: 0,
      };
    }),
  );
}

export function FlowTextCanvas({
  backgroundColor = "transparent",
  className = "",
  colorFlowSpeed = 3,
}: {
  backgroundColor?: string;
  className?: string;
  colorFlowSpeed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");

    if (!canvas || !parent || !context) return;

    let animationFrame = 0;
    let colorOffset = Math.floor(Math.random() * CIRCLES_PER_SEGMENT);
    let height = 0;
    let heightAdjust = 0;
    let points: FlowPoint[] = [];
    let scale = 1;
    let width = 0;
    const flowSpeed = Math.max(1, colorFlowSpeed);
    const segment = Math.floor((CIRCLES_PER_SEGMENT * POINT_COUNT) / colors.length) / 2;
    const colorCycleLength = segment * colors.length;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getColor = (circleIndex: number) => {
      const phase = (circleIndex + colorOffset) % colorCycleLength;
      const colorIndex = Math.floor(phase / segment) % colors.length;
      const colorProgress = phase % segment;
      const current = colors[colorIndex];
      const next = colors[(colorIndex + 1) % colors.length];
      const t = Math.min(1, colorProgress / segment);

      const r = current.r + (next.r - current.r) * t;
      const g = current.g + (next.g - current.g) * t;
      const b = current.b + (next.b - current.b) * t;

      return `rgb(${r | 0},${g | 0},${b | 0})`;
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);

      width = Math.max(320, rect.width);
      height = Math.max(220, rect.height);
      scale = (width * 0.92) / NATURAL_WIDTH;
      heightAdjust = height / 2 - (NATURAL_HEIGHT * scale) / 2;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const xAdjust = (width - NATURAL_WIDTH * scale) / 2;
      points = createPoints(scale, xAdjust);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (backgroundColor !== "transparent") {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";

      let previousWiggleX = 0;
      let previousWiggleY = 0;
      let circleIndex = 0;
      const radius = Math.max(4.5, 16 * scale);

      for (let index = 0; index < POINT_COUNT; index += 1) {
        const point = points[index];
        point.wiggleX = reducedMotion ? 0 : wiggleLooper(point.countX);
        point.wiggleY = reducedMotion ? 0 : wiggleLooper(point.countY);

        if (point.startsStroke) {
          previousWiggleX = point.wiggleX;
          previousWiggleY = point.wiggleY;
        }

        for (let step = 0; step < 100; step += 100 / CIRCLES_PER_SEGMENT) {
          const t = step / 100;

          context.beginPath();
          context.arc(
            cubicN(t, point.sx + previousWiggleX, point.scx - point.wiggleX, point.ecx + point.wiggleX, point.ex + point.wiggleX),
            cubicN(
              t,
              point.sy + previousWiggleY + heightAdjust,
              point.scy + point.wiggleY + heightAdjust,
              point.ecy - point.wiggleY + heightAdjust,
              point.ey + point.wiggleY + heightAdjust,
            ),
            radius,
            0,
            Math.PI * 2,
          );
          context.fillStyle = getColor(circleIndex);
          context.fill();
          circleIndex += 1;
        }

        previousWiggleX = point.wiggleX;
        previousWiggleY = point.wiggleY;
        point.countX += (Math.random() * 100) * point.invert;
        point.countY += (Math.random() * 100) * point.invert;
      }

      colorOffset = (colorOffset - flowSpeed + colorCycleLength) % colorCycleLength;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);

    resize();
    draw();
    observer.observe(parent);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [backgroundColor, colorFlowSpeed]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
