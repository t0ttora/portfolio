"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { Terminal } from "lucide-react";
import { GridPattern } from "@/components/GridPattern";

export const LoadingScreen = () => (
  <motion.div
    aria-busy="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="fixed inset-0 z-[300] flex items-center justify-center bg-[#1688e8]"
  >
    <div className="absolute inset-0">
      <GridPattern />
    </div>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative bg-white/95 backdrop-blur-xl border border-white/40 ring-1 ring-black/5 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] p-8 w-[320px] text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-3 text-slate-800">
        <Terminal size={18} className="text-blue-600" />
        <span className="font-mono text-xs tracking-widest font-bold">SYSTEM BOOT</span>
      </div>
      <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-4">OLUŞ EMRE DEMİR</h1>
      <p className="text-xs text-slate-500 font-mono mb-6">DESIGN ENGINEER // MAKER</p>

      <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="h-full bg-blue-500"
        />
      </div>
      <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-2">
        <Radio size={12} className="text-blue-500" />
        <span>Initializing desk layout…</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-500/70"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.06 }}
          />
        ))}
      </div>
    </motion.div>
  </motion.div>
);
