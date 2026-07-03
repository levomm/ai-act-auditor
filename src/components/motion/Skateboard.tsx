import React from "react";

export function Skateboard() {
  return (
    <div
      className="skateboard-asset absolute bottom-[15%] left-[25%] w-[500px] h-[120px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shadow */}
      <div
        className="absolute inset-0 bg-black/50 blur-lg rounded-full"
        style={{ transform: "translateZ(-30px) translateY(40px) scale(0.8)" }}
      />

      {/* Board Base */}
      <div
        className="absolute inset-0 bg-orange-600 rounded-full border-b-[15px] border-orange-800 shadow-2xl overflow-hidden flex items-center justify-center"
        style={{ transform: "translateZ(0px)" }}
      >
        <div className="text-black/30 font-black text-6xl tracking-widest rotate-2">GRIND</div>
        <div className="absolute left-[15%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner" />
        <div className="absolute left-[20%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner" />
        <div className="absolute right-[15%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner" />
        <div className="absolute right-[20%] top-1/2 w-4 h-4 bg-zinc-400 rounded-full shadow-inner" />
      </div>
    </div>
  );
}
