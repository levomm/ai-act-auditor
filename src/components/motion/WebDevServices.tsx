import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function WebDevServices({ onClick }: { onClick: () => void }) {
  const tiltRef = use3DTilt({ rotationFactor: 0.08, liftZ: 80, durationOut: 0.4, durationIn: 0.9 });

  // Layers for thick box extrusion
  const layers = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div
      ref={tiltRef}
      onClick={onClick}
      className="webdev-asset absolute top-[60%] left-[45%] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Deep Glowing Shadow */}
      <div
        className="absolute inset-0 bg-primary/40 blur-3xl rounded-xl transition-all duration-500 group-hover:bg-primary/60 group-hover:blur-[40px] group-hover:scale-110"
        style={{ transform: "translateZ(-80px) scale(1.1)" }}
      />

      {/* Extruded box layers */}
      {layers.map((i) => (
        <div
          key={i}
          className="absolute inset-0 bg-zinc-900 border border-primary/20 rounded-xl"
          style={{ transform: `translateZ(${-i * 4}px)` }}
        />
      ))}

      {/* Main Plaque / Front Layer */}
      <div
        className="relative bg-zinc-950 border-2 border-primary/50 px-10 py-6 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden group-hover:border-primary transition-colors duration-500"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Neon scanline sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

        {/* CRT scanlines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />

        <span className="relative z-10 text-3xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(var(--primary),1)]">
          &lt;WEB_DEV_SERVICES /&gt;
        </span>
      </div>
    </div>
  );
}
