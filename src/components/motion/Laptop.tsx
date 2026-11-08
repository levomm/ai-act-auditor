import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function Laptop() {
  const tiltRef = use3DTilt();

  // Create layers for the laptop body extrusion
  const baseLayers = Array.from({ length: 16 }, (_, i) => i);
  const screenLayers = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      ref={tiltRef}
      className="laptop-asset absolute top-[35%] right-[10%] w-[450px] h-[320px] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Deep Shadow */}
      <div
        className="absolute inset-0 bg-black/80 rounded-xl blur-3xl transition-all duration-500 group-hover:bg-black/60 group-hover:blur-[40px]"
        style={{ transform: "translateZ(-120px) scale(0.85) translateY(30px)" }}
      />

      {/* Base thickness */}
      {baseLayers.map((i) => (
        <div
          key={`base-${i}`}
          className={`absolute inset-x-0 bottom-0 h-[30px] rounded-b-xl ${i % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'}`}
          style={{ transform: `translateZ(${-i * 2}px) translateY(15px) rotateX(25deg)` }}
        />
      ))}

      {/* Screen thickness */}
      {screenLayers.map((i) => (
        <div
          key={`screen-${i}`}
          className={`absolute inset-0 rounded-xl border border-zinc-600 ${i % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'}`}
          style={{ transform: `translateZ(${-i * 2}px)` }}
        />
      ))}

      {/* Front layer representing laptop screen */}
      <div
        className="absolute inset-0 bg-zinc-800 rounded-xl border-4 border-zinc-500 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Webcam dot */}
        <div className="h-[20px] w-full flex items-center justify-center bg-zinc-900 border-b border-zinc-700">
          <div className="w-[6px] h-[6px] rounded-full bg-black border border-zinc-600 flex items-center justify-center">
            <div className="w-[2px] h-[2px] rounded-full bg-blue-500/50" />
          </div>
        </div>

        <div className="flex-1 bg-black p-2">
          {/* Code screen mockup */}
          <div className="h-full rounded bg-[#1e1e1e] p-4 text-green-500 font-mono text-sm leading-relaxed border border-zinc-800">
            <div className="opacity-70">&gt; init motion_engine</div>
            <div className="opacity-70">&gt; loading textures... [OK]</div>
            <div className="opacity-70">&gt; mounting DOM nodes... [OK]</div>
            <div className="opacity-70">&gt; calculating Z-depths... [OK]</div>
            <div className="text-white mt-2 animate-pulse">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
