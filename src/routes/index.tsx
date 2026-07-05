import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!containerRef.current || !sceneRef.current) return;

    // We animate all elements with these classes
    const assets = gsap.utils.toArray([
      ".osx01-asset",
      ".laptop-asset",
      ".skateboard-asset",
      ".spraycan-asset",
      ".webdev-asset",
    ]) as HTMLElement[];

    // Initial state: plahvatuslikult (explosively) scattered and shattered in Z space
    gsap.set(assets, {
      z: () => gsap.utils.random(1000, 3000),
      x: () => gsap.utils.random(-1500, 1500),
      y: () => gsap.utils.random(-1500, 1500),
      rotationX: () => gsap.utils.random(-180, 180),
      rotationY: () => gsap.utils.random(-180, 180),
      rotationZ: () => gsap.utils.random(-180, 180),
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      },
    });

    // Assemble state
    tl.to(assets, {
      z: 0,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power3.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30">
      {/*
        Scroll container: h-[400vh] to allow for a long scroll.
        We use GSAP to pin the scene.
      */}
      <div ref={containerRef} className="relative w-full h-[400vh]">
        {/* The sticky 3D viewport */}
        <div
          className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          {/*
            The scene wrapper.
            We preserve 3D so children can have deep Z extrusions.
            It's dimmable via state.
          */}
          <div
            ref={sceneRef}
            className={`relative w-full h-full max-w-7xl mx-auto transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isPanelActive ? "opacity-20 blur-md pointer-events-none" : "opacity-100"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isPanelActive
                ? "translateZ(-800px) scale(0.9)"
                : "translateZ(0px) scale(1)",
            }}
          >
            {/* Concrete-textured background plane deep in Z space to catch shadows */}
            <div
              className="absolute inset-[-50%] pointer-events-none -z-10 bg-zinc-900 border border-white/5 shadow-2xl"
              style={{
                transform: "translateZ(-200px)",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
              }}
            >
              {/* Ambient Lighting on the concrete */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/90 pointer-events-none" />
            </div>

            <OSX01 />
            <Laptop />
            <Skateboard />
            <SprayCan />

            <WebDevServices onClick={() => setIsPanelActive(true)} />
          </div>

          {/* Cyberpunk Service Panel */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-surface-1/90 backdrop-blur-xl border border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.2)] rounded-2xl w-full max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isPanelActive
                ? "opacity-100 pointer-events-auto transform translate-z-0 scale-100"
                : "opacity-0 pointer-events-none transform translate-z-[-200px] scale-90"
            }`}
          >
            <h2 className="text-3xl font-bold text-primary mb-4 font-mono tracking-tighter">
              &gt; WEB_DEV_SERVICES.EXE
            </h2>
            <div className="space-y-4 text-muted-foreground font-mono text-sm leading-relaxed">
              <p className="border-l-2 border-primary pl-4">[INITIATING UPLINK...]</p>
              <p>
                We construct high-fidelity interactive zones. No generic layouts. Absolute visual
                dominance.
              </p>
              <ul className="list-none space-y-2 text-foreground/80">
                <li>
                  <span className="text-primary mr-2">+</span> 3D Motion Engineering
                </li>
                <li>
                  <span className="text-primary mr-2">+</span> Immersive WebGL Experiences
                </li>
                <li>
                  <span className="text-primary mr-2">+</span> Scroll-Driven Storytelling
                </li>
              </ul>
              <button
                onClick={() => setIsPanelActive(false)}
                className="mt-8 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary text-primary transition-colors font-bold uppercase tracking-widest w-full text-center"
              >
                [ RETURN_TO_CANVAS ]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
