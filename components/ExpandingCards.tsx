"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

const cards = [
  { color: "#c0392b", label: "#c0392b" },
  { color: "#eea303", label: "#eea303" },
  { color: "#f1c40f", label: "#f1c40f" },
  { color: "#64bb5d", label: "#64bb5d" },
  { color: "#16a085", label: "#16a085" },
  { color: "#0e83cd", label: "#0e83cd" },
  { color: "#702fa8", label: "#702fa8" },
  { color: "#f7f1e8", label: "Pick a color!" },
];

export function ExpandingCards() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="expanding-card-stage" aria-label="Expandable color cards" data-expanded={expanded}>
      <div className="expanding-card-stack">
        {cards.map((card, index) => (
          <button
            key={card.label}
            className="expanding-card-arm"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
            style={{
              "--card-color": card.color,
              "--card-angle": `${index * 20}deg`,
            } as CSSProperties}
          >
            <span className="expanding-card">
              <span className="expanding-card-point" aria-hidden="true" />
              <span className="expanding-card-label">{card.label}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
