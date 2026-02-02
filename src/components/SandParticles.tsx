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
  twinklePhase: number;
  colorIndex: number;
}

// Lookup tables para optimizar funciones trigonométricas
const SIN_TABLE_SIZE = 360;
const sinTable = new Float32Array(SIN_TABLE_SIZE);
const cosTable = new Float32Array(SIN_TABLE_SIZE);
for (let i = 0; i < SIN_TABLE_SIZE; i++) {
  const angle = (i / SIN_TABLE_SIZE) * Math.PI * 2;
  sinTable[i] = Math.sin(angle);
  cosTable[i] = Math.cos(angle);
}

function fastSin(angle: number): number {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor((normalized / (Math.PI * 2)) * SIN_TABLE_SIZE) % SIN_TABLE_SIZE;
  return sinTable[index];
}

function fastCos(angle: number): number {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor((normalized / (Math.PI * 2)) * SIN_TABLE_SIZE) % SIN_TABLE_SIZE;
  return cosTable[index];
}

const SandParticles: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: true, // Mejora rendimiento
    });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    // Aumentado significativamente con optimizaciones
    const particleCount = isMobile ? 120 : 350;
    
    // Pre-crear colores como strings completos
    const colorStrings = [
      "rgba(210, 180, 140,",
      "rgba(244, 164, 96,",
      "rgba(218, 165, 32,",
      "rgba(255, 230, 150,",
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${canvas.height / dpr}px`;
      ctx.scale(dpr, dpr);
      init();
    };

    const init = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 0.5 + 0.1,
          vx: Math.random() * 2 + 1,
          vy: Math.random() * 0.3 - 0.15,
          baseOpacity: Math.random() * 0.3 + 0.05,
          opacity: 0,
          twinklePhase: Math.random() * Math.PI * 2,
          colorIndex: Math.floor(Math.random() * colorStrings.length),
        });
      }
    };

    let time = 0;

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, w, h);
      time += 0.003;
      
      // Pre-calcular valores globales
      const swirlX = w * 0.5 + fastSin(time * 0.5) * w * 0.25;
      const swirlYPos = h * 0.5 + fastCos(time * 0.7) * h * 0.25;
      const timePhase = time * 0.001;
      
      // Batch rendering: preparar estilos una vez
      ctx.lineCap = "round";
      
      // Loop optimizado - minimizar llamadas a funciones
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        
        // Twinkle optimizado
        p.opacity = p.baseOpacity + fastSin(p.twinklePhase + timePhase * 50) * 0.05;
        
        // Swirl optimizado - evitar sqrt cuando sea posible
        const dx = p.x - swirlX;
        const dy = p.y - swirlYPos;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const force = distSq < 160000 ? Math.max(0, (400 - dist) * 0.0025) : 0; // 400*400 = 160000
        
        if (force > 0) {
          const angle = Math.atan2(dy, dx);
          const swirlForceX = fastSin(angle + 1.5708) * force * 3; // 1.5708 = PI/2
          const swirlForceY = fastCos(angle + 1.5708) * force * 3;
          
          const currentVx = p.vx + swirlForceX + fastSin(time + p.y * 0.005);
          const currentVy = p.vy + swirlForceY + fastCos(time * 0.5 + p.x * 0.005) * 0.5;
          
          // Dibujo optimizado
          const speedSq = currentVx * currentVx + currentVy * currentVy;
          if (speedSq > 0.01) {
            const motionAngle = Math.atan2(currentVy, currentVx);
            const lineLength = Math.sqrt(speedSq) * 1.5;
            const cosMA = Math.cos(motionAngle);
            const sinMA = Math.sin(motionAngle);
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - cosMA * lineLength, p.y - sinMA * lineLength);
            ctx.strokeStyle = `${colorStrings[p.colorIndex]} ${p.opacity})`;
            ctx.lineWidth = p.size;
            ctx.stroke();
          }
          
          p.x += currentVx;
          p.y += currentVy;
        } else {
          // Sin fuerza de swirl, movimiento base
          const currentVx = p.vx + fastSin(time + p.y * 0.005);
          const currentVy = p.vy + fastCos(time * 0.5 + p.x * 0.005) * 0.5;
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - currentVx * 1.5, p.y - currentVy * 1.5);
          ctx.strokeStyle = `${colorStrings[p.colorIndex]} ${p.opacity})`;
          ctx.lineWidth = p.size;
          ctx.stroke();
          
          p.x += currentVx;
          p.y += currentVy;
        }
        
        // Wrap around optimizado
        if (p.x < -100) p.x = w + 100;
        else if (p.x > w + 100) p.x = -100;
        if (p.y < -100) p.y = h + 100;
        else if (p.y > h + 100) p.y = -100;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeHandler = () => resize();
    window.addEventListener("resize", resizeHandler);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resizeHandler);
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
        opacity: 0.7,
      }}
    />
  );
};

export default SandParticles;
