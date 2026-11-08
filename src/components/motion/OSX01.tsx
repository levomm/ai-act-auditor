import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function OSX01() {
  const tiltRef = use3DTilt();

  // Creating an array for tight Z-axis layer doubling (extrusion)
  const layers = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div
      ref={tiltRef}
      className="osx01-asset absolute top-[10%] left-[20%] w-[600px] h-[300px] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Deep Contact Shadow */}
      <div
        className="absolute inset-0 bg-black/80 blur-2xl transition-all duration-500 group-hover:bg-black/50 group-hover:blur-3xl group-hover:translate-y-4"
        style={{ transform: "translateZ(-80px) scale(0.95)" }}
      >
        <span className="text-[12rem] font-black tracking-tighter text-transparent">OSX01</span>
      </div>

      {/* Extruded side walls (layer doubling) */}
      {layers.map((i) => (
        <div key={i} className="absolute inset-0" style={{ transform: `translateZ(${-i * 2}px)` }}>
          <span className={`text-[12rem] font-black tracking-tighter ${i % 2 === 0 ? 'text-zinc-800' : 'text-zinc-900'}`}>OSX01</span>
        </div>
      ))}

      {/* Front layer */}
      <div className="absolute inset-0" style={{ transform: "translateZ(0px)" }}>
        <span className="text-[12rem] font-black tracking-tighter text-zinc-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          OSX01
        </span>
      </div>
    </div>
  );
}
