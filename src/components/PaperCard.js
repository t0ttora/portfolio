"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Settings, Terminal, Zap } from "lucide-react";

export const PaperCard = memo(({ data, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: 0.15 + index * 0.04,
        ease: "easeOut"
      }}
      style={{
        position: "absolute",
        left: data.pos.x,
        top: data.pos.y,
        rotate: data.rotation,
        zIndex: 1,
      }}
      whileHover={{
        y: -4,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        zIndex: 50,
        borderColor: "#94a3b8",
        transition: { duration: 0.15 },
      }}
      whileTap={{
        scale: 0.985,
        y: -2,
        transition: { duration: 0.08 },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      className="w-[300px] min-h-[240px] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] cursor-pointer group flex flex-col font-mono text-xs text-slate-800 border border-slate-200 rounded-sm transition-colors duration-200"
    >
      <div className="w-full h-full flex flex-col bg-white rounded-sm overflow-hidden border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">
              {data.title}
            </span>
            <div className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-sm">
              {data.status}
            </div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-wider">
            <span>REF: {data.refCode}</span>
            <span>{data.date}</span>
          </div>
        </div>
        <div className="flex-1 p-4 relative bg-white">
          <div className="relative z-10">
            <div className="mb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 w-fit">
              {data.shortDesc}
            </div>
            <p className="mb-4 leading-relaxed font-sans text-sm text-slate-600 line-clamp-4">
              {data.content}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {data.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-full border border-slate-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 opacity-[0.08] rotate-[-15deg] pointer-events-none">
          {data.category === "MECH" && <Settings size={64} />}
          {data.category === "ELEC" && <Zap size={64} />}
          {data.category === "SOFT" && <Terminal size={64} />}
        </div>
      </div>
    </motion.div>
  );
});

PaperCard.displayName = "PaperCard";
