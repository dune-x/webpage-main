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
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 700; // Even higher density
    const colors = [
      "rgba(210, 180, 140,", // Tan
      "rgba(244, 164, 96,",  // Sandy Brown
      "rgba(218, 165, 32,",  // Goldenrod
      "rgba(255, 230, 150,", // Pale Gold
    ];

    const handleMouseMove = (e: MouseEvent) => {
      // Mouse position needs to account for scroll because canvas is absolute
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY,
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      init();
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.6 + 0.1, // Even finer
          vx: Math.random() * 3 + 1.5,    // Much higher speed
          vy: Math.random() * 0.4 - 0.2,
          baseOpacity: baseOpacity,
          opacity: baseOpacity,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005; // Slightly faster time
      
      const swirlX = canvas.width / 2 + Math.sin(time * 0.5) * (canvas.width / 3);
      const swirlYPos = canvas.height / 2 + Math.cos(time * 0.7) * (canvas.height / 3);

      for (const p of particles) {
        p.opacity = p.baseOpacity + Math.sin(Date.now() * p.twinkleSpeed) * 0.1;

        // Mouse Repulsion logic
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        let rx = 0;
        let ry = 0;
        
        if (mdist < 150) {
          const rforce = (150 - mdist) / 150;
          rx = (mdx / mdist) * rforce * 10;
          ry = (mdy / mdist) * rforce * 10;
        }

        // Swirl / Vortex logic
        const dx = p.x - swirlX;
        const dy = p.y - swirlYPos;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, (600 - dist) / 600);
        
        const angle = Math.atan2(dy, dx);
        const swirlForceX = Math.sin(angle + Math.PI / 1.5) * force * 5; // Increased swirl force
        const swirlForceY = Math.cos(angle + Math.PI / 1.5) * force * 5;

        const currentVx = p.vx + swirlForceX + rx + Math.sin(time + p.y * 0.01) * 2;
        const currentVy = p.vy + swirlForceY + ry + Math.cos(time * 0.8 + p.x * 0.01) * 0.8;
        
        ctx.beginPath();
        const motionAngle = Math.atan2(currentVy, currentVx);
        const lineLength = Math.sqrt(currentVx * currentVx + currentVy * currentVy) * 2.5;
        
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
          p.x - Math.cos(motionAngle) * lineLength,
          p.y - Math.sin(motionAngle) * lineLength
        );
        
        ctx.strokeStyle = `${p.color} ${p.opacity})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.stroke();

        p.x += currentVx;
        p.y += currentVy;

        if (p.x < -150) p.x = canvas.width + 150;
        if (p.x > canvas.width + 150) p.x = -150;
        if (p.y < -150) p.y = canvas.height + 150;
        if (p.y > canvas.height + 150) p.y = -150;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", // Not fixed anymore
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
