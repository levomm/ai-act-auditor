import { useEffect, useRef } from "react";
import gsap from "gsap";

export function use3DTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Organic 3D tilt based on mouse position relative to element center
      gsap.to(el, {
        rotationY: x * 0.05,
        rotationX: -y * 0.05,
        z: 50, // Lift slightly towards viewer on hover
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      // Reset position when mouse leaves
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
}
