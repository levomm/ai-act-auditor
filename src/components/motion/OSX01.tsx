import React from "react";
import { use3DTilt } from "../../hooks/use3DTilt";

export function OSX01() {
  const tiltRef = use3DTilt<HTMLDivElement>();

  return (
    <div
      className="osx01-asset absolute top-[10%] left-[20%] w-[600px] h-[300px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          className="absolute inset-0 bg-black blur-2xl opacity-60 rounded-[4rem]"
          style={{ transform: "translateZ(-100px) scale(0.9)" }}
        />

        {/* 2.5D Extrusion Layers (Side walls) */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateZ(${-i * 2}px)` }}
          >
            <span
              className="text-[12rem] font-black tracking-tighter text-black"
              style={{ WebkitTextStroke: "2px #333" }}
            >
              OSX01
            </span>
          </div>
        ))}

        {/* Front layer */}
        <div className="absolute inset-0" style={{ transform: "translateZ(0px)" }}>
          <span className="text-[12rem] font-black tracking-tighter text-white drop-shadow-xl">
            OSX01
          </span>
        </div>
      </div>
    </div>
  );
}
