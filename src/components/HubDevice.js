"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { PROFILE, EXPERIENCE, CX, CY } from "@/lib/data";
import { useVault } from "@/components/vault/VaultProvider";
import { useRapidTapTrigger } from "@/components/vault/useRapidTapTrigger";

export const HubDevice = memo(() => {
  const [activeTab, setActiveTab] = useState("bio");
  const { open: openVault } = useVault();
  const { onTap: onAvatarTap } = useRapidTapTrigger(openVault, {
    taps: 5,
    windowMs: 2000,
  });

  return (
    <div
      className="absolute w-[90vw] max-w-[420px] bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl z-40 flex flex-col border border-slate-800 ring-1 ring-white/5"
      style={{ left: CX - 210, top: CY - 150 }}
    >
      <div className="h-10 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/50 rounded-t-xl">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-[9px] font-mono text-slate-500 font-medium tracking-wider">
          UNIT_ID: Oluş-Emre
        </span>
      </div>

      <div className="p-6 text-slate-300 flex-1 flex flex-col">
        <div className="flex items-center gap-5 mb-6">
          <button
            type="button"
            onClick={onAvatarTap}
            className="shrink-0 rounded-xl"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Image
              src={PROFILE.avatar}
              alt="Profile"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl shadow-lg object-cover border border-slate-700"
              priority
            />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {PROFILE.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                {PROFILE.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab("bio")}
            className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors relative ${
              activeTab === "bio"
                ? "text-blue-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            BIO
            {activeTab === "bio" && (
              <motion.div
                layoutId="tabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("exp")}
            className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors relative ${
              activeTab === "exp"
                ? "text-blue-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            EXPERIENCE_LOG
            {activeTab === "exp" && (
              <motion.div
                layoutId="tabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        </div>

        <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "bio" ? (
              <motion.div
                key="bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-sm leading-relaxed text-slate-400 font-sans">
                  {PROFILE.bio}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PROFILE.socials).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors group"
                    >
                      {key === "linkedin" && (
                        <Linkedin
                          size={14}
                          className="text-slate-500 group-hover:text-blue-400"
                        />
                      )}
                      {key === "github" && (
                        <Github
                          size={14}
                          className="text-slate-500 group-hover:text-white"
                        />
                      )}
                      {key === "mail" && (
                        <Mail
                          size={14}
                          className="text-slate-500 group-hover:text-emerald-400"
                        />
                      )}
                      <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-white">
                        {key}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="exp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {EXPERIENCE.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-slate-700 pb-1"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900 border-2 border-blue-500"></div>
                    <h4 className="text-sm font-bold text-white">
                      {exp.role}
                    </h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-400">
                        {exp.company}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1 rounded">
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="h-1.5 bg-slate-800/50 rounded-b-xl border-t border-slate-800 mx-4 mb-2"></div>
    </div>
  );
});

HubDevice.displayName = "HubDevice";
