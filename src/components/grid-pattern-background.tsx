'use client';
import React, { useRef, useEffect, useCallback } from 'react';

const GridPatternBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const time = useRef(0);
  const colorRef = useRef('hsla(0, 0%, 100%, 0.05)'); // A safe default

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const gridSize = 40;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colorRef.current;
    
    // Draw grid points
    for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
            const angle = time.current * 0.01 + (x + y) * 0.01;
            const radius = 1 + Math.sin(angle) * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const updateColor = () => {
        try {
            const rootStyle = getComputedStyle(document.body);
            const foregroundHsl = rootStyle.getPropertyValue('--primary-foreground').trim();
            if (foregroundHsl) {
                colorRef.current = `hsla(${foregroundHsl} / 0.05)`;
            }
        } catch (e) {
            console.error("Could not parse theme colors for background animation.", e);
        }
    };
    
    const dpr = window.devicePixelRatio || 1;
    const handleResize = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        updateColor();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      time.current += 1;
      draw(ctx);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw]);

  return (
    <div className="absolute inset-0 z-0 bg-background">
      <canvas ref={canvasRef} className="h-full w-full" />
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
};

export default GridPatternBackground;
