"use client";

import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
}

export default function ScrollReveal({
  children,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, triggerOnce]);

  // Memoize placeholder to prevent re-renders
  const placeholder = useMemo(() => <div style={{ minHeight: "1px" }} />, []);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {isVisible ? children : placeholder}
    </div>
  );
}
