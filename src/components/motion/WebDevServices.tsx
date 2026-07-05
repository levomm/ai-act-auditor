import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function WebDevServices({ onClick }: { onClick: () => void }) {
  const tiltRef = use3DTilt<HTMLDivElement>();

  return (
    <div
      onClick={onClick}
      className="webdev-asset absolute top-[60%] left-[45%] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          className="absolute inset-0 bg-primary/30 blur-2xl rounded-lg group-hover:bg-primary/50 transition-colors duration-500"
          style={{ transform: "translateZ(-100px) scale(1.1) translateY(20px)" }}
        />

        {/* 2.5D Extrusion Layers (Plaque Thickness) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-zinc-950 border border-primary/20 rounded-lg pointer-events-none transition-colors duration-500 group-hover:bg-zinc-900 group-hover:border-primary/40"
            style={{ transform: `translateZ(${-i * 2}px)` }}
          />
        ))}

        {/* Main Plaque Front */}
        <div
          className="relative bg-zinc-900 border-2 border-primary/50 px-8 py-4 rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden flex items-center justify-center transition-colors duration-500 group-hover:bg-zinc-800"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Glitch/Scanline effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

          <span className="text-2xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] pointer-events-none relative z-10">
            &lt;WEB_DEV_SERVICES /&gt;
          </span>
        </div>
      </div>
    </div>
  );
}
