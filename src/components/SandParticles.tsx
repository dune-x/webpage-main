"use client";

import { useEffect, useRef, type FC } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  color: string;
}

const SandParticles: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let scrollY = window.scrollY;
    const particleCount = 400; // Even finer, so we need more
    const colors = [
      "rgba(210, 180, 140,", // Tan
      "rgba(244, 164, 96,",  // Sandy Brown
      "rgba(218, 165, 32,",  // Goldenrod
      "rgba(255, 230, 150,", // Pale Gold
    ];

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1 + 0.2, // Much finer
          vx: Math.random() * 2 + 1,    // Higher horizontal speed
          vy: Math.random() * 0.2 - 0.1, // Minimal vertical movement
          baseOpacity: baseOpacity,
          opacity: baseOpacity,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    let time = 0;
    let lastScrollY = window.scrollY;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;
      
      // Gusty wind logic: strong horizontal shifts
      const globalWind = Math.sin(time) * 1.5 + Math.cos(time * 0.5) * 1;
      const scrollDelta = (scrollY - lastScrollY) * 0.3;
      lastScrollY = scrollY;

      for (const p of particles) {
        p.opacity = p.baseOpacity + Math.sin(Date.now() * p.twinkleSpeed) * 0.1;

        // Apply scroll delta (inverted sensation for descending)
        p.y -= scrollDelta * (p.size * 0.5);

        const currentVx = p.vx + globalWind;
        
        // Use lines instead of circles for "motion blur" feel
        ctx.beginPath();
        const lineLength = currentVx * 2; // Length based on speed
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - lineLength, p.y);
        ctx.strokeStyle = `${p.color} ${p.opacity})`;
        ctx.lineWidth = p.size;
        ctx.stroke();

        p.x += currentVx;
        p.y += p.vy;

        // Wrap around horizontally
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        
        // Wrap around vertically
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
};

export default SandParticles;
