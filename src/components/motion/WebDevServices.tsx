import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export function WebDevServices({ onClick }: { onClick: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        rotationY: x * 0.05,
        rotationX: -y * 0.05,
        z: 50,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="webdev-asset absolute top-[60%] left-[45%] cursor-pointer group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shadow */}
      <div
        className="absolute inset-0 bg-primary/20 blur-2xl rounded-lg group-hover:bg-primary/40 transition-colors duration-500"
        style={{ transform: "translateZ(-60px) scale(1.1)" }}
      />

      {/* Main Plaque */}
      <div
        className="relative bg-zinc-900 border border-primary/30 px-8 py-4 rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="text-2xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]">
          &lt;WEB_DEV_SERVICES /&gt;
        </span>
      </div>
    </div>
  );
}
