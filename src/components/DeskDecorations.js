"use client";

import { memo } from "react";
import Image from "next/image";
import { CX, CY } from "@/lib/data";

export const FunSticker = memo(({ emoji, x, y, r, s }) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{
      left: x,
      top: y,
      transform: `rotate(${r}deg) scale(${s})`,
    }}
  >
    <div 
      className="text-5xl leading-none"
      style={{
        textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 0 0 white, -2px 0 0 white, 0 2px 0 white, 0 -2px 0 white',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))'
      }}
    >
      {emoji}
    </div>
  </div>
));

FunSticker.displayName = "FunSticker";

export const CoffeeStain = memo(() => null);

CoffeeStain.displayName = "CoffeeStain";

export const WarningTape = memo(() => (
  <div
    className="absolute bg-yellow-300 text-slate-900 h-8 flex items-center justify-center font-bold uppercase tracking-widest text-sm shadow-md z-10 overflow-hidden w-56 mix-blend-hard-light opacity-90 border-y border-black/20"
    style={{ left: CX + 900, top: CY + 700, transform: "rotate(6deg)" }}
  >
    PROTOTYPE AREA
  </div>
));

WarningTape.displayName = "WarningTape";

export const Chip = memo(() => (
  <div
    className="absolute w-16 h-16 bg-[#2a2a2a] rounded border border-gray-600 shadow-xl z-10 flex items-center justify-center group"
    style={{ left: CX - 850, top: CY - 750, transform: "rotate(-10deg)" }}
  >
    <div className="absolute inset-0 border-[2px] border-[#fbbf24] opacity-40 rounded"></div>
    <div className="text-[6px] font-mono text-gray-400 leading-none text-center">
      MCU
      <br />
      IC
      <br />
      <span className="text-[8px] text-white">555</span>
    </div>
    <div className="absolute -left-1 top-1 bottom-1 w-1 flex flex-col justify-between py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-1 bg-gray-400 w-full rounded-l"></div>
      ))}
    </div>
    <div className="absolute -right-1 top-1 bottom-1 w-1 flex flex-col justify-between py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-1 bg-gray-400 w-full rounded-r"></div>
      ))}
    </div>
  </div>
));

Chip.displayName = "Chip";

export const Ruler = memo(() => (
  <div
    className="absolute w-[600px] h-12 bg-white/90 backdrop-blur shadow-lg border border-white/50 z-20 rounded-sm"
    style={{ left: CX - 800, top: CY + 750, transform: "rotate(1.5deg)" }}
  >
    <div className="h-full flex items-end pb-2 px-4 gap-1 justify-between">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className={`w-px bg-slate-400 ${i % 5 === 0 ? "h-5" : "h-2.5"}`}
        ></div>
      ))}
    </div>
    <span className="absolute top-2 right-4 text-[8px] font-mono text-slate-400 tracking-[0.2em]">
      PRECISION SCALE
    </span>
  </div>
));

Ruler.displayName = "Ruler";

export const AlbumCover = ({ cover, x, y, r }) => (
  <div
    className="absolute w-36 h-36 bg-black rounded shadow-2xl z-10 border border-white/10 group overflow-hidden relative"
    style={{ left: x, top: y, transform: `rotate(${r}deg)` }}
  >
    <Image
      src={cover}
      alt="Album"
      fill
      sizes="144px"
      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
    <div className="absolute inset-0 rounded-full border-[20px] border-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </div>
);
