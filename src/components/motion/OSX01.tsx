import React, { useRef, useEffect } from "react";

export function OSX01() {
  return (
    <div
      className="osx01-asset absolute top-[10%] left-[20%] w-[600px] h-[300px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Back layer (shadow/thickness) */}
      <div
        className="absolute inset-0 bg-black blur-md opacity-50"
        style={{ transform: "translateZ(-20px)" }}
      >
        <span
          className="text-[12rem] font-black tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "4px black" }}
        >
          OSX01
        </span>
      </div>

      {/* Front layer */}
      <div className="absolute inset-0" style={{ transform: "translateZ(0px)" }}>
        <span className="text-[12rem] font-black tracking-tighter text-white drop-shadow-2xl">
          OSX01
        </span>
      </div>
    </div>
  );
}
