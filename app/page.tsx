import type { CSSProperties } from "react";
import { ExpandingCards } from "@/components/ExpandingCards";
import { FlowTextCanvas } from "@/components/FlowTextCanvas";
import { homeVisualConfig } from "@/components/homeVisualConfig";

export default function Home() {
  const homeStyle = {
    "--home-canvas-bg": homeVisualConfig.canvas.backgroundColor,
  } as CSSProperties;

  return (
    <main className="liquid-home h-screen overflow-hidden" style={homeStyle}>
      <FlowTextCanvas
        backgroundColor={homeVisualConfig.canvas.backgroundColor}
        className="liquid-flow-canvas"
        colorFlowSpeed={homeVisualConfig.flowText.colorSpeed}
      />
      {/* <ExpandingCards /> */}
    </main>
  );
}
