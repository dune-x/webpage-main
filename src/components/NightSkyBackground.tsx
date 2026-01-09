"use client";

import { useEffect, useState, useRef } from 'react';


const NightSkyBackground = () => {
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      
      // If content is shorter than viewport, no scrolling needed
      if (maxScroll <= 0) {
        setOffsetY(0);
        return;
      }

      const imageHeight = imageRef.current.offsetHeight;
      const maxTranslate = imageHeight - windowHeight;

      // Ensure we don't translate if image is shorter than window (shouldn't happen with min-h-screen but good safety)
      if (maxTranslate <= 0) {
        setOffsetY(0);
        return;
      }

      const maxParallaxRatio = 0.5; // Controls maximum speed (0.5 means background moves at half the speed of content)
      
      let effectiveMaxTranslate = maxTranslate;
      const currentRatio = maxTranslate / maxScroll;

      if (currentRatio > maxParallaxRatio) {
         effectiveMaxTranslate = maxScroll * maxParallaxRatio;
      }

      const scrollFraction = scrollY / maxScroll;
      const translate = -scrollFraction * effectiveMaxTranslate;
      
      setOffsetY(translate);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
        pointerEvents: 'none', // Ensure clicks pass through
        backgroundColor: '#000', // Fallback
      }}
    >
      <div
        style={{
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform',
          width: '100%',
          // Use a minimum height to ensure it covers screen, but allow it to be naturally taller
          minHeight: '100vh', 
        }}
      >
        {/* We use specific styling to ensure the image maintains aspect ratio and covers width, 
            but height is determined by the image's aspect ratio relative to width. 
            If the image fits within the viewport height, parallax won't happen (handled in JS).
            We want it to be likely taller than viewport. */}
        <img
          ref={imageRef}
          src="/images/background-night.jpg"
          alt="Night Sky Background"
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
