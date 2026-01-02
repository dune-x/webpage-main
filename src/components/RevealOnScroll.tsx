"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { RevealFx } from "@once-ui-system/core";

type RevealOnScrollProps = {
  children: ReactNode;
  translateY?: number;
  delay?: number; // opcional, solo para stagger dentro de una misma sección
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  horizontal?: "left" | "center" | "right";
  fillWidth?: boolean;
};

export default function RevealOnScroll({
  children,
  translateY = 10,
  delay = 0,
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  horizontal = "center",
  fillWidth = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return (
    <div ref={ref}>
      {shown ? (
        <RevealFx
          translateY={translateY}
          delay={delay}
          horizontal={horizontal}
          fillWidth={fillWidth}
        >
          {children}
        </RevealFx>
      ) : (
        // Mantiene el layout para evitar saltos
        <div style={{ visibility: "hidden" }}>{children}</div>
      )}
    </div>
  );
}
