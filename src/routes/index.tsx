import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OSX01 } from "../components/motion/OSX01";
import { Laptop } from "../components/motion/Laptop";
import { Skateboard } from "../components/motion/Skateboard";
import { SprayCan } from "../components/motion/SprayCan";
import { WebDevServices } from "../components/motion/WebDevServices";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: "Motion Engine - Graffiti Vision" }],
  }),
});

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isPanelActive, setIsPanelActive] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // We animate all elements with these classes
      const assets = gsap.utils.toArray([
        ".osx01-asset",
        ".laptop-asset",
        ".skateboard-asset",
        ".spraycan-asset",
        ".webdev-asset",
      ]) as HTMLElement[];

      // Initial state: plahvatuslikult (explosively) shattered in deep Z space
      gsap.set(assets, {
        z: () => gsap.utils.random(-3000, -1000), // Push them backwards in Z-space, not towards the camera past perspective
        x: () => gsap.utils.random(-1500, 1500), // Wide scatter
        y: () => gsap.utils.random(-1500, 1500),
        rotationX: () => gsap.utils.random(-180, 180),
        rotationY: () => gsap.utils.random(-180, 180),
        rotationZ: () => gsap.utils.random(-180, 180),
        scale: () => gsap.utils.random(0.2, 3), // Varied scale for chaos
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Smoother scrubbing for large movements
        },
      });

      // Assemble state: bringing them to their configured transform values
      tl.to(assets, {
        z: 0,
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        opacity: 1,
        duration: 2,
        stagger: 0.15, // Slight stagger so they don't arrive exactly together
        ease: "power3.inOut",
      });
    }, container); // Scope GSAP to the container

    return () => ctx.revert(); // Cleanup GSAP safely for React strict mode
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* SVG Filters for concrete texture */}
      <svg className="hidden">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
        </filter>
      </svg>

      {/*
        Scroll container: h-[500vh] to allow for a very long scroll
        We use GSAP to pin the scene.
      */}
      <div ref={containerRef} className="relative w-full h-[500vh]">
        {/* The sticky 3D viewport */}
        <div
          className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-950"
          style={{ perspective: "2000px" }}
        >
          {/* Concrete Wall Background Texture */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />
            <div
              className="absolute inset-0 mix-blend-overlay opacity-30"
              style={{ filter: "url(#noise)" }}
            />
            {/* Dramatic ambient vignette lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          </div>

          {/*
            The scene wrapper.
            We preserve 3D so children can have deep Z extrusions.
          */}
          <div
            ref={sceneRef}
            className={`relative w-full h-full max-w-[1400px] mx-auto z-10 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isPanelActive ? "opacity-10 blur-2xl pointer-events-none" : "opacity-100"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isPanelActive
                ? "translateZ(-2000px) scale(0.6) rotateY(-10deg)"
                : "translateZ(0px) scale(1) rotateY(0deg)",
            }}
          >
            <OSX01 />
            <Laptop />
            <Skateboard />
            <SprayCan />
            <WebDevServices onClick={() => setIsPanelActive(true)} />
          </div>

          {/* Cyberpunk Service Panel */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-8 bg-zinc-950/90 backdrop-blur-3xl border border-primary/50 shadow-[0_0_100px_rgba(var(--primary),0.3)] rounded-2xl w-full max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isPanelActive
                ? "opacity-100 pointer-events-auto transform translate-z-0 scale-100"
                : "opacity-0 pointer-events-none transform translate-z-[-400px] scale-90"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Holographic grid overlay on panel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl pointer-events-none opacity-20" />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-primary mb-6 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]">
                &gt; WEB_DEV_SERVICES.EXE
              </h2>
              <div className="space-y-6 text-zinc-300 font-mono text-sm leading-relaxed">
                <div className="border-l-4 border-primary pl-4 py-1 bg-primary/5">
                  <p className="text-primary animate-pulse">[UPLINK ESTABLISHED...]</p>
                </div>
                <p className="text-base text-zinc-400">
                  We construct high-fidelity interactive zones. No generic layouts. Absolute visual
                  dominance.
                </p>
                <ul className="list-none space-y-3 text-zinc-300">
                  <li className="flex items-center gap-3">
                    <span className="text-primary bg-primary/10 p-1 rounded">+</span> 3D Motion
                    Engineering
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary bg-primary/10 p-1 rounded">+</span> Immersive
                    WebGL Experiences
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary bg-primary/10 p-1 rounded">+</span> Scroll-Driven
                    Storytelling
                  </li>
                </ul>
                <button
                  onClick={() => setIsPanelActive(false)}
                  className="mt-10 px-6 py-4 bg-primary/10 hover:bg-primary/20 border border-primary text-primary transition-all duration-300 font-black uppercase tracking-[0.2em] w-full text-center hover:shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                >
                  [ RETURN_TO_CANVAS ]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
