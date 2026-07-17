import { useEffect, useRef } from "react";
import gsap from "gsap";

export function use3DTilt(
  options = { rotationFactor: 0.05, liftZ: 50, durationOut: 0.5, durationIn: 0.8 },
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = el.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        rotationY: x * options.rotationFactor,
        rotationX: -y * options.rotationFactor,
        z: options.liftZ,
        duration: options.durationOut,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: options.durationIn,
        ease: "power2.out",
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleLeave);
    el.addEventListener("touchcancel", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleLeave);
      el.removeEventListener("touchcancel", handleLeave);
    };
  }, [options.rotationFactor, options.liftZ, options.durationOut, options.durationIn]);

  return ref;
}
