"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Play, Pause, SkipForward } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GridPattern } from "@/components/GridPattern";
import { AlbumCover } from "@/components/DeskDecorations";
import { PLAYLIST } from "@/lib/data";

export default function SongsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full min-h-screen relative bg-[#1688e8] font-sans text-slate-800 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GridPattern />
      </div>

      {/* Floating Album Covers */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <AlbumCover cover={PLAYLIST[0].cover} x="10%" y="20%" r={-15} />
        <AlbumCover cover={PLAYLIST[1].cover} x="80%" y="15%" r={10} />
        <AlbumCover cover={PLAYLIST[2].cover} x="75%" y="70%" r={-5} />
        <AlbumCover cover={PLAYLIST[3].cover} x="15%" y="65%" r={20} />
      </div>

      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-20 flex items-center justify-center min-h-screen p-4 pb-24"
      >
        <div className="bg-[#111] w-full max-w-md rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-gray-800 overflow-hidden flex flex-col relative">
          <div className="h-48 bg-black relative flex flex-col items-center justify-center overflow-hidden border-b border-gray-800 group">
            <div
              className="absolute inset-0 bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)]"
              style={{ backgroundSize: "4px 4px", opacity: 0.2 }}
            ></div>

            <div className="z-10 text-center">
              <motion.div
                animate={{
                  textShadow: isPlaying
                    ? ["0 0 10px #22c55e", "0 0 20px #22c55e", "0 0 10px #22c55e"]
                    : "0 0 0px #22c55e",
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`font-mono text-5xl font-bold tracking-tighter transition-colors ${
                  isPlaying ? "text-green-500" : "text-gray-600"
                }`}
              >
                102.4
              </motion.div>
              <div className="text-green-800 text-[10px] font-mono mt-1 uppercase tracking-[0.4em]">
                Engineer&apos;s FM
              </div>
            </div>

            {/* Audio Visualizer */}
            <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-[3px] px-8 opacity-50">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [5, 5 + ((i * 13) % 40), 5] }
                      : { height: 5 }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    delay: i * 0.05,
                  }}
                  className={`w-2 rounded-t-sm ${
                    isPlaying ? "bg-green-500" : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#1a1a1a] flex-1">
            <h3 className="text-gray-500 text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
              <Radio size={12} /> Current Rotation
            </h3>
            <div className="space-y-1">
              {PLAYLIST.map((song, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentSong(idx);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg group cursor-pointer transition-colors border border-transparent ${
                    currentSong === idx
                      ? "bg-white/10 border-white/5"
                      : "hover:bg-white/5 hover:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs w-4 ${
                        currentSong === idx ? "text-green-500" : "text-gray-700"
                      }`}
                    >
                      {currentSong === idx && isPlaying ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity }}
                        >
                          ▶
                        </motion.div>
                      ) : (
                        `0${idx + 1}`
                      )}
                    </span>
                    <div>
                      <div
                        className={`font-bold text-sm transition-colors ${
                          currentSong === idx
                            ? "text-green-400"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {song.title}
                      </div>
                      <div className="text-gray-600 text-xs font-medium">
                        {song.artist}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-700 text-[10px] font-mono">
                    {song.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 pb-4">
              <button className="text-gray-500 hover:text-white transition-colors">
                <SkipForward className="rotate-180" size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-green-600 text-black rounded-full flex items-center justify-center hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause fill="black" className="ml-0.5" size={28} />
                ) : (
                  <Play fill="black" className="ml-1" size={28} />
                )}
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                <SkipForward size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
