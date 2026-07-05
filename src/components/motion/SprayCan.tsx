import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function SprayCan() {
  const tiltRef = use3DTilt<HTMLDivElement>();

  return (
    <div
      className="spraycan-asset absolute bottom-[25%] right-[30%] w-[100px] h-[280px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          className="absolute inset-0 bg-black/80 blur-2xl rounded-full"
          style={{ transform: "translateZ(-100px) translate-x-[30px] scale(0.85)" }}
        />

        {/* 2.5D Extrusion Layers (Can Cylinder approximation) */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-red-950 rounded-3xl pointer-events-none"
            style={{ transform: `translateZ(${-i * 1.5}px) scaleX(${1 - i * 0.005})` }}
          />
        ))}

        {/* Can Body Front */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-500 to-red-800 rounded-3xl border-l-4 border-white/30 shadow-2xl flex flex-col items-center"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Cap */}
          <div
            className="w-[80px] h-[40px] bg-zinc-800 rounded-t-2xl mt-[-20px] shadow-[0_-5px_15px_rgba(0,0,0,0.5)] border-t border-white/20 relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Cap thickness */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`cap-${i}`}
                className="absolute inset-0 bg-zinc-900 rounded-t-2xl pointer-events-none"
                style={{ transform: `translateZ(${-i * 2}px)` }}
              />
            ))}
          </div>

          {/* Nozzle */}
          <div
            className="w-[10px] h-[15px] bg-zinc-300 absolute top-[-30px] right-[20px] rounded-sm shadow-md"
            style={{ transform: "translateZ(10px)" }}
          />

          {/* Label */}
          <div className="mt-8 w-full h-[120px] bg-zinc-900 border-y-4 border-zinc-950 flex items-center justify-center relative shadow-inner overflow-hidden">
            <span className="text-white font-black -rotate-90 tracking-[0.3em] text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] pointer-events-none">
              TOXIC
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
