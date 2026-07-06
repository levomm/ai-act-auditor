import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function Skateboard() {
  const tiltRef = use3DTilt();

  // Create layers for the deck thickness (plywood layers)
  const deckLayers = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      ref={tiltRef}
      className="skateboard-asset absolute bottom-[15%] left-[15%] w-[550px] h-[140px] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Deep Ground Shadow */}
      <div
        className="absolute inset-0 bg-black/90 blur-2xl rounded-full transition-all duration-500 group-hover:bg-black/70 group-hover:blur-3xl"
        style={{ transform: "translateZ(-80px) translateY(60px) scale(0.85)" }}
      />

      {/* Wheels/Trucks fake representation for depth behind */}
      <div
        className="absolute left-[20%] top-1/2 w-[40px] h-[60px] bg-zinc-800 rounded-lg"
        style={{ transform: "translateZ(-30px) translateY(-50%)" }}
      />
      <div
        className="absolute right-[20%] top-1/2 w-[40px] h-[60px] bg-zinc-800 rounded-lg"
        style={{ transform: "translateZ(-30px) translateY(-50%)" }}
      />

      {/* Deck Thickness (Plywood layers) */}
      {deckLayers.map((i) => {
        // Alternate colors slightly for plywood effect
        const colorClass = i % 2 === 0 ? "bg-amber-800" : "bg-amber-900";
        return (
          <div
            key={i}
            className={`absolute inset-0 ${colorClass} rounded-full`}
            style={{ transform: `translateZ(${-i * 2}px)` }}
          />
        );
      })}

      {/* Front layer (Grip tape / Graphic) */}
      <div
        className="absolute inset-0 bg-zinc-900 rounded-full border border-zinc-700 shadow-2xl overflow-hidden flex flex-col items-center justify-center"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Subtle grip tape texture noise overlay can go here, using a gradient for now */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />

        {/* Graphic */}
        <div className="text-orange-500 font-black text-7xl tracking-[0.2em] rotate-[-2deg] drop-shadow-md mix-blend-color-dodge">
          GRIND
        </div>

        {/* Hardware (Screws) */}
        <div className="absolute left-[15%] top-[30%] w-3 h-3 bg-zinc-400 rounded-full shadow-inner border border-zinc-600" />
        <div className="absolute left-[15%] bottom-[30%] w-3 h-3 bg-zinc-400 rounded-full shadow-inner border border-zinc-600" />
        <div className="absolute right-[15%] top-[30%] w-3 h-3 bg-zinc-400 rounded-full shadow-inner border border-zinc-600" />
        <div className="absolute right-[15%] bottom-[30%] w-3 h-3 bg-zinc-400 rounded-full shadow-inner border border-zinc-600" />
      </div>
    </div>
  );
}
