"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Github, ChevronRight } from "lucide-react";

export const ProjectModal = ({
  selectedCard,
  setSelectedCard,
  setViewingDoc,
  showEmptyState = false,
}) => {
  if (!selectedCard && !showEmptyState) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={() => setSelectedCard(null)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white w-full max-w-3xl shadow-2xl relative rounded-xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[85vh] z-50"
      >
        {selectedCard ? (
          <>
            <div className="bg-white p-6 md:p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded tracking-wider uppercase">
                    {selectedCard.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedCard.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {selectedCard.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 md:p-8 font-sans text-slate-600 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-10">
                <div className="md:col-span-2 space-y-8 order-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Abstract
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {selectedCard.content}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Key Deliverables
                    </h3>
                    <ul className="text-sm space-y-3 list-disc pl-4 marker:text-blue-500">
                      <li>
                        Core architecture utilizing{" "}
                        <strong>{selectedCard.tech[0]}</strong> and{" "}
                        <strong>{selectedCard.tech[1]}</strong>.
                      </li>
                      <li>
                        Rigorous testing completed in{" "}
                        <strong>{selectedCard.status}</strong> phase with
                        focus on reliability.
                      </li>
                      <li>
                        Optimized for performance efficiency and scalability.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-1 bg-slate-50 p-5 rounded-lg h-fit border border-slate-100 order-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target size={14} className="text-blue-500" /> Tech
                      Stack
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedCard.tech.map((t) => (
                        <div
                          key={t}
                          className="bg-white px-3 py-2 text-xs font-medium border border-slate-200 rounded text-slate-600 shadow-sm"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <button
                      onClick={() => setViewingDoc(selectedCard)}
                      className="flex-1 py-3 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 w-full"
                    >
                      READ{" "}
                      <ChevronRight size={14} className="flex-shrink-0" />
                    </button>
                    <button className="w-full sm:w-12 py-3 bg-white text-slate-700 rounded border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm">
                      <Github size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-100 mt-auto sticky bottom-0">
              <span className="font-mono">
                ID: {selectedCard.id.toUpperCase()}
              </span>
              <span className="font-mono">STATUS: {selectedCard.status}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
            <div className="text-xs uppercase tracking-[0.3em]">Preview</div>
            <div className="text-xl font-semibold text-slate-700">No card selected</div>
            <div className="text-sm text-slate-500">
              Click a card on the canvas to read its details here.
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
