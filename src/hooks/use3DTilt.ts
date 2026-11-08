import { useEffect, useRef } from "react";
import gsap from "gsap";

export function use3DTilt(
  options = { rotationFactor: 0.05, liftZ: 50, durationOut: 0.5, durationIn: 0.8 },
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        rotationY: x * options.rotationFactor,
        rotationX: -y * options.rotationFactor,
        z: options.liftZ,
        duration: options.durationOut,
        ease: "power2.out",
      });
    };

    const handlePointerLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: options.durationIn,
        ease: "power2.out",
      });
    };

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [options.rotationFactor, options.liftZ, options.durationOut, options.durationIn]);

  return ref;
}
