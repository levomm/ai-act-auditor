import React from "react";

export function Laptop() {
  return (
    <div
      className="laptop-asset absolute top-[40%] right-[15%] w-[400px] h-[300px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Fake thickness/shadow */}
      <div
        className="absolute inset-0 bg-black/60 rounded-xl blur-xl"
        style={{ transform: "translateZ(-40px) scale(0.9)" }}
      />

      {/* Front layer representing laptop */}
      <div
        className="absolute inset-0 bg-zinc-800 rounded-xl border-4 border-zinc-700 shadow-2xl flex items-center justify-center overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        <div className="absolute inset-2 bg-black rounded-lg">
          {/* Code screen mockup */}
          <div className="p-4 text-green-500 font-mono text-xs opacity-70">
            <div>&gt; init motion_engine</div>
            <div>&gt; loading textures...</div>
            <div>&gt; OK.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
