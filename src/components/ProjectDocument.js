"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";

export const ProjectDocument = ({ project, onClose }) => {
  const hasHtml = Boolean(project?.details && String(project.details).trim());
  if (!project.deepDive && !hasHtml) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[200] bg-slate-950 text-slate-300 overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group sticky top-0 py-4 bg-slate-950/80 backdrop-blur-sm z-50 w-full"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          BACK TO DESK
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-800 rounded text-xs font-mono tracking-widest uppercase">
              {project.category}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {project.date}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            {project.title}
          </h1>

          {hasHtml ? (
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-blockquote:border-blue-500"
              dangerouslySetInnerHTML={{ __html: project.details }}
            />
          ) : (
            <>
              <div className="text-lg md:text-xl text-slate-400 leading-relaxed font-serif italic border-l-4 border-blue-500 pl-6 mb-16 py-2">
                &ldquo;{project.deepDive.intro}&rdquo;
              </div>

              <div className="space-y-20">
                {project.deepDive.sections.map((section, idx) => (
                  <div key={idx} className="group">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-baseline gap-4">
                      <span className="text-blue-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                        0{idx + 1}
                      </span>
                      {section.head}
                    </h3>
                    <p className="text-slate-300 leading-8 text-lg font-sans">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {project.deepDive.conclusion && (
                <div className="mt-20 p-8 bg-neutral-900 rounded-xl border border-neutral-800">
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">
                    Conclusion
                  </h4>
                  <p className="text-slate-200 text-lg leading-relaxed font-medium">
                    {project.deepDive.conclusion}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center text-sm text-slate-600 font-mono">
            <span>REF: {project.refCode}</span>
            <span>END OF DOC</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
