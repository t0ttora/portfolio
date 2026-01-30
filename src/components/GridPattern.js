"use client";

import { memo } from "react";

// Reusable Grid Background
// NOTE: During drag, we can disable the noise layer (expensive to repaint)
// to keep the desk movement buttery smooth.
export const GridPattern = memo(({ disableNoise = false } = {}) => (
  <>
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `linear-gradient(to right, #fff 1.5px, transparent 1.5px), linear-gradient(to bottom, #fff 1.5px, transparent 1.5px)`,
        backgroundSize: "200px 200px",
        borderStyle: "dashed",
      }}
    />

    {!disableNoise && (
      <>
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ filter: "url(#noise)" }}
        ></div>
        <svg className="hidden">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </svg>
      </>
    )}
  </>
));

GridPattern.displayName = "GridPattern";
