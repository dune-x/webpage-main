"use client";

import { useEffect, useState, useRef } from 'react';


const NightSkyBackground = () => {
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>();
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        rafRef.current = requestAnimationFrame(() => {
          if (!imageRef.current) {
            ticking.current = false;
            return;
          }

          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const maxScroll = documentHeight - windowHeight;
          
          // If content is shorter than viewport, no scrolling needed
          if (maxScroll <= 0) {
            setOffsetY(0);
            ticking.current = false;
            return;
          }

          const imageHeight = imageRef.current.offsetHeight;
          const maxTranslate = imageHeight - windowHeight;

          // Ensure we don't translate if image is shorter than window
          if (maxTranslate <= 0) {
            setOffsetY(0);
            ticking.current = false;
            return;
          }

          const maxParallaxRatio = 0.5;
          
          let effectiveMaxTranslate = maxTranslate;
          const currentRatio = maxTranslate / maxScroll;

          if (currentRatio > maxParallaxRatio) {
             effectiveMaxTranslate = maxScroll * maxParallaxRatio;
          }

          const scrollFraction = scrollY / maxScroll;
          const translate = -scrollFraction * effectiveMaxTranslate;
          
          setOffsetY(translate);
          ticking.current = false;
        });
      }
    };

    // Passive listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial calculation after paint
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(handleScroll);
    } else {
      setTimeout(handleScroll, 0);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: '#000',
        contain: 'layout style paint', // CSS containment for performance
      }}
    >
      <div
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`, // Use translate3d for GPU acceleration
          willChange: 'transform',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <img
          ref={imageRef}
          src="/images/background-night.jpg"
          alt=""
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '100vh',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default NightSkyBackground;
