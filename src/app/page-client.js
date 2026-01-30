"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

// Components
import { Navbar } from "@/components/Navbar";
import { GridPattern } from "@/components/GridPattern";
import { PaperCard } from "@/components/PaperCard";
import { HubDevice } from "@/components/HubDevice";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectDocument } from "@/components/ProjectDocument";
import { LoadingScreen } from "@/components/LoadingScreen";
import {
  FunSticker,
  CoffeeStain,
  WarningTape,
  Ruler,
  Chip,
} from "@/components/DeskDecorations";

// Data
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CX,
  CY,
  PROJECTS,
  STICKERS,
} from "@/lib/data";

export default function HomePageClient() {
  const [showBootLoader, setShowBootLoader] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });
  const isDraggingCanvas = useRef(false);
  const searchParams = useSearchParams();
  const isAdminParam = searchParams.get("admin") === "1";
  const isEmbedded = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const isAdminEmbed = isAdminParam || isEmbedded;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const centerX = window.innerWidth / 2 - CX;
      const centerY = window.innerHeight / 2 - CY;
      x.set(centerX);
      y.set(centerY);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [x, y]);

  useEffect(() => {
    // Loader only on first load per tab session.
    let showTimer;
    let hideTimer;

    try {
      const booted = sessionStorage.getItem("deskBooted") === "1";
      if (booted) return;

      showTimer = setTimeout(() => {
        setShowBootLoader(true);
        hideTimer = setTimeout(() => {
          try {
            sessionStorage.setItem("deskBooted", "1");
          } catch {
            // If sessionStorage is blocked, don't hard-fail.
          }
          setShowBootLoader(false);
        }, 1200);
      }, 0);
    } catch {
      // If sessionStorage is blocked, skip loader to avoid mismatch.
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#1688e8] font-sans text-slate-800 cursor-default selection:bg-blue-200">
      {/* Loading Screen */}
      <AnimatePresence>{showBootLoader && <LoadingScreen />}</AnimatePresence>

      {/* Navbar */}
      <Navbar />

      {/* Main Desk View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full overflow-hidden relative"
      >
        {/* Draggable Workspace Container */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          style={{ x, y, willChange: "transform" }}
          dragConstraints={{
            left: -(CANVAS_WIDTH - viewport.w),
            right: 0,
            top: -(CANVAS_HEIGHT - viewport.h),
            bottom: 0,
          }}
          className="absolute w-[3000px] h-[2000px] cursor-grab active:cursor-grabbing bg-[#1688e8]"
          onDragStart={() => {
            isDraggingCanvas.current = true;
            setIsDragging(true);
          }}
          onDragEnd={() => {
            setTimeout(() => {
              isDraggingCanvas.current = false;
              setIsDragging(false);
            }, 100);
          }}
        >
          <GridPattern disableNoise={isDragging} />

          {/* Stickers & Decor */}
          {STICKERS.map((s, i) => (
            <FunSticker key={i} {...s} />
          ))}
          <CoffeeStain />
          <WarningTape />
          <Ruler />
          <Chip />
          <HubDevice />

          {/* Project Cards */}
          {PROJECTS.map((project, index) => (
            <PaperCard
              key={project.id}
              data={project}
              index={index}
              onSelect={(data) => {
                if (isDraggingCanvas.current) return;
                if (isAdminEmbed && window.parent && window.parent !== window) {
                  window.parent?.postMessage(
                    {
                      type: "admin-portfolio-select",
                      id: data.id,
                      title: data.title,
                      ref_code: data.refCode,
                      category: data.category,
                      short_desc: data.shortDesc,
                      card_date: data.date,
                      status: data.status,
                      description: data.content,
                      tech: data.tech,
                      position_x: data.pos?.x ?? 0,
                      position_y: data.pos?.y ?? 0,
                      rotation: data.rotation ?? 0,
                    },
                    "*",
                  );
                }
                setSelectedCard(data);
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedCard && !viewingDoc && (
          <ProjectModal
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            setViewingDoc={setViewingDoc}
          />
        )}
      </AnimatePresence>

      {/* Full Document View */}
      <AnimatePresence>
        {viewingDoc && (
          <ProjectDocument project={viewingDoc} onClose={() => setViewingDoc(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
