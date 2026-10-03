import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";
import { range } from "@/lib/utils";

export function SprayCan() {
  const tiltRef = use3DTilt();

  // Create layers to simulate a cylindrical extrusion for the can body
  const canLayers = range(12);

  return (
    <div
      ref={tiltRef}
      className="spraycan-asset absolute bottom-[20%] right-[25%] w-[120px] h-[320px] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Deep Shadow */}
      <div
        className="absolute inset-0 bg-black/80 blur-2xl rounded-full transition-all duration-500 group-hover:bg-black/50 group-hover:blur-3xl"
        style={{ transform: "translateZ(-50px) translate-x-[40px] translateY(20px) scale(0.9)" }}
      />

      {/* Cap depth */}
      <div
        className="absolute top-[-35px] left-1/2 -translate-x-1/2 w-[90px] h-[45px] bg-zinc-900 rounded-t-3xl"
        style={{ transform: "translateZ(-10px)" }}
      />

      {/* Nozzle depth */}
      <div
        className="absolute top-[-45px] right-[25px] w-[15px] h-[20px] bg-zinc-400 rounded-sm"
        style={{ transform: "translateZ(-5px)" }}
      />

      {/* Can Body Depth (Cylindrical illusion via layer doubling) */}
      {canLayers.map((i) => {
        // Darken edges slightly for cylindrical shading
        const widthShrink = Math.abs(i - 6) * 1.5;
        return (
          <div
            key={i}
            className="absolute inset-y-0 bg-red-900 rounded-3xl"
            style={{
              left: `${widthShrink}px`,
              right: `${widthShrink}px`,
              transform: `translateZ(${-i * 3}px)`,
            }}
          />
        );
      })}

      {/* Front layer (Label and metallic finish) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-500 to-red-900 rounded-3xl border-l-4 border-white/30 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Cap Front */}
        <div className="absolute top-0 w-full h-[20px] bg-gradient-to-b from-zinc-300 to-zinc-500 border-b-2 border-black/20" />

        {/* Label */}
        <div className="mt-16 w-full h-[160px] bg-zinc-950 border-y-4 border-zinc-800 flex items-center justify-center relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
          <span className="text-white font-black -rotate-90 tracking-[0.3em] text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            TOXIC
          </span>
        </div>

        {/* Bottom metal rim */}
        <div className="absolute bottom-0 w-full h-[15px] bg-gradient-to-b from-zinc-500 to-zinc-400 border-t-2 border-black/20 rounded-b-3xl" />
      </div>

      {/* Front Nozzle/Cap pieces for true 3D stacking */}
      <div
        className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[80px] h-[35px] bg-zinc-800 rounded-t-2xl shadow-lg border-t-2 border-white/20"
        style={{ transform: "translateZ(5px)" }}
      />
      <div
        className="absolute top-[-40px] right-[20px] w-[12px] h-[15px] bg-zinc-200 rounded-sm shadow-md"
        style={{ transform: "translateZ(5px)" }}
      >
        <div className="absolute right-[-2px] top-[2px] w-[4px] h-[4px] rounded-full bg-black/80" />
      </div>
    </div>
  );
}
