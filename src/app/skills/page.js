"use client";

import { motion } from "framer-motion";
import { Terminal, Settings, Zap, Wrench, Globe, Briefcase, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GridPattern } from "@/components/GridPattern";
import { SKILLS_CATEGORIES, SOFT_SKILLS, LANGUAGES } from "@/lib/data";

// Add icons to categories at render time
const getCategoryIcon = (id) => {
  switch (id) {
    case "core": return <Terminal size={16} />;
    case "mech": return <Settings size={16} />;
    case "elec": return <Zap size={16} />;
    case "tools": return <Wrench size={16} />;
    default: return null;
  }
};

export default function SkillsPage() {
  return (
    <div className="w-full min-h-screen relative bg-[#1688e8] font-sans text-slate-800">
      <div className="absolute inset-0 z-0">
        <GridPattern />
      </div>
      
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8 pb-24"
      >
        <div className="bg-white/95 backdrop-blur-xl w-full max-w-5xl rounded-2xl shadow-2xl border border-white/50 flex flex-col overflow-hidden ring-1 ring-black/5">
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tighter">
                TECHNICAL_SPECS
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                CONFIDENTIAL // OE-DEMIR
              </span>
            </div>
            <Cpu className="text-blue-400" size={32} />
          </div>
          <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {SKILLS_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  <div
                    className={`px-4 py-3 border-b border-slate-100 flex items-center gap-2 font-bold text-xs tracking-wider ${cat.bg} ${cat.color}`}
                  >
                    {getCategoryIcon(cat.id)} {cat.title}
                  </div>
                  <div className="p-4 space-y-4 flex-1">
                    {cat.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-[10px] font-mono mb-1 font-bold text-slate-600">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{
                              duration: 1.2,
                              ease: "easeOut",
                              delay: 0.3,
                            }}
                            className={`h-full ${
                              cat.id === "core"
                                ? "bg-blue-500"
                                : cat.id === "mech"
                                ? "bg-amber-500"
                                : cat.id === "elec"
                                ? "bg-emerald-500"
                                : "bg-purple-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe size={14} /> Communication Protocols
                </h3>
                <div className="space-y-3">
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.name}
                      className="flex justify-between items-center border-b border-slate-50 pb-2"
                    >
                      <span className="text-xs font-bold text-slate-700">
                        {lang.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Briefcase size={14} /> Operational Modules
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-mono font-medium rounded border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
