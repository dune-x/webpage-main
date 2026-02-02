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

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Detectar si es móvil para reducir aún más o desactivar
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // En móvil, no mostrar partículas para mejor rendimiento
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 150; // Reducido de 700 a 150 (78% menos)
    const colors = [
      "rgba(210, 180, 140,", // Tan
      "rgba(244, 164, 96,",  // Sandy Brown
      "rgba(218, 165, 32,",  // Goldenrod
      "rgba(255, 230, 150,", // Pale Gold
    ];

    const handleMouseMove = (e: MouseEvent) => {
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
        const baseOpacity = Math.random() * 0.3 + 0.05; // Reducida opacidad
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.5 + 0.1,
          vx: Math.random() * 2 + 1,    // Velocidad reducida
          vy: Math.random() * 0.3 - 0.15,
          baseOpacity: baseOpacity,
          opacity: baseOpacity,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    let time = 0;
    let lastTime = 0;

    const draw = (currentTime: number) => {
      // Limitar a ~30 FPS en lugar de 60 FPS
      if (currentTime - lastTime < 33) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003; // Más lento
      
      // Swirl simplificado - precalcular
      const swirlX = canvas.width / 2 + Math.sin(time * 0.5) * (canvas.width / 4);
      const swirlYPos = canvas.height / 2 + Math.cos(time * 0.7) * (canvas.height / 4);

      for (const p of particles) {
        // Twinkle más ligero
        p.opacity = p.baseOpacity + Math.sin(currentTime * 0.001 * p.twinkleSpeed) * 0.05;

        // Mouse Repulsion simplificado
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mdist = mdx * mdx + mdy * mdy; // Usar distancia al cuadrado (no sqrt)
        let rx = 0;
        let ry = 0;
        
        if (mdist < 22500) { // 150*150
          const rforce = (22500 - mdist) / 22500;
          const invDist = 1 / Math.sqrt(mdist);
          rx = mdx * invDist * rforce * 8;
          ry = mdy * invDist * rforce * 8;
        }

        // Swirl simplificado
        const dx = p.x - swirlX;
        const dy = p.y - swirlYPos;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, (400 - dist) / 400); // Reducido radio
        
        const angle = Math.atan2(dy, dx);
        const swirlForceX = Math.sin(angle + Math.PI / 2) * force * 3;
        const swirlForceY = Math.cos(angle + Math.PI / 2) * force * 3;

        const currentVx = p.vx + swirlForceX + rx + Math.sin(time + p.y * 0.005) * 1;
        const currentVy = p.vy + swirlForceY + ry + Math.cos(time * 0.5 + p.x * 0.005) * 0.5;
        
        ctx.beginPath();
        const motionAngle = Math.atan2(currentVy, currentVx);
        const lineLength = Math.sqrt(currentVx * currentVx + currentVy * currentVy) * 1.5;
        
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

        // Wrap around simplificado
        if (p.x < -100) p.x = canvas.width + 100;
        else if (p.x > canvas.width + 100) p.x = -100;
        if (p.y < -100) p.y = canvas.height + 100;
        else if (p.y > canvas.height + 100) p.y = -100;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    resize();
    draw(0);

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
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7, // Reducida opacidad global
      }}
    />
  );
};

export default SandParticles;
