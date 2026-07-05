import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function Skateboard() {
  const tiltRef = use3DTilt<HTMLDivElement>();

  return (
    <div
      className="skateboard-asset absolute bottom-[15%] left-[25%] w-[500px] h-[120px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          className="absolute inset-0 bg-black/70 blur-2xl rounded-full"
          style={{ transform: "translateZ(-100px) translateY(50px) scale(0.9)" }}
        />

        {/* 2.5D Extrusion Layers (Board Thickness) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-orange-900 rounded-full border border-orange-950 pointer-events-none"
            style={{ transform: `translateZ(${-i * 2}px)` }}
          />
        ))}

        {/* Board Base Front */}
        <div
          className="absolute inset-0 bg-orange-600 rounded-full shadow-2xl overflow-hidden flex items-center justify-center border-2 border-orange-500"
          style={{ transform: "translateZ(0px)" }}
        >
          <div className="text-black/30 font-black text-6xl tracking-widest rotate-2 pointer-events-none">
            GRIND
          </div>

          {/* Bolts */}
          <div className="absolute left-[15%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner border border-zinc-500" />
          <div className="absolute left-[20%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner border border-zinc-500" />
          <div className="absolute right-[15%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner border border-zinc-500" />
          <div className="absolute right-[20%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner border border-zinc-500" />
        </div>
      </div>
    </div>
  );
}
