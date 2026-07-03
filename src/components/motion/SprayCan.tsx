import React from "react";

export function SprayCan() {
  return (
    <div
      className="spraycan-asset absolute bottom-[25%] right-[30%] w-[100px] h-[280px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shadow */}
      <div
        className="absolute inset-0 bg-black/60 blur-xl rounded-full"
        style={{ transform: "translateZ(-25px) translate-x-[20px] scale(0.8)" }}
      />

      {/* Can Body */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-500 to-red-800 rounded-3xl border-l-4 border-white/20 shadow-2xl flex flex-col items-center"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Cap */}
        <div className="w-[80px] h-[40px] bg-zinc-800 rounded-t-2xl mt-[-20px] shadow-lg border-t-2 border-white/10" />
        {/* Nozzle */}
        <div className="w-[10px] h-[15px] bg-zinc-300 absolute top-[-30px] right-[20px] rounded-sm" />

        {/* Label */}
        <div className="mt-8 w-full h-[120px] bg-zinc-900 border-y-4 border-zinc-950 flex items-center justify-center">
          <span className="text-white font-black -rotate-90 tracking-widest">TOXIC</span>
        </div>
      </div>
    </div>
  );
}
