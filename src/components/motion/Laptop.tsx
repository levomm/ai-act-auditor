import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function Laptop() {
  const tiltRef = use3DTilt<HTMLDivElement>();

  return (
    <div
      className="laptop-asset absolute top-[40%] right-[15%] w-[400px] h-[300px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          className="absolute inset-0 bg-black/80 rounded-xl blur-2xl"
          style={{ transform: "translateZ(-100px) scale(0.85) translateY(20px)" }}
        />

        {/* 2.5D Extrusion Layers (Thickness) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800 pointer-events-none"
            style={{ transform: `translateZ(${-i * 2}px)` }}
          />
        ))}

        {/* Front layer representing laptop */}
        <div
          className="absolute inset-0 bg-zinc-800 rounded-xl border-4 border-zinc-700 shadow-2xl flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          <div className="absolute inset-2 bg-black rounded-lg">
            {/* Code screen mockup */}
            <div className="p-4 text-green-500 font-mono text-xs opacity-80">
              <div>&gt; init motion_engine</div>
              <div>&gt; mounting 2.5D vectors...</div>
              <div>&gt; depth extrusion [OK]</div>
              <div className="animate-pulse mt-2">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
