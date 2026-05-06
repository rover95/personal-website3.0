import type { CSSProperties } from "react";

const frostedPanelStyle = {
  WebkitBackdropFilter: "blur(4px) saturate(1.1)",
  backdropFilter: "blur(4px) saturate(1.1)",
} satisfies CSSProperties;

export function FrostedGlassPanel() {
  return (
    <aside className="frosted-glass-panel" aria-label="Frosted glass panel" style={frostedPanelStyle}>
      <div className="frosted-glass-panel-inner">
        <p>FROSTED</p>
        <h2>Glass Panel</h2>
      </div>
    </aside>
  );
}
