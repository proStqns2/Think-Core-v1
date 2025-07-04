'use client';
import React, { useRef, useEffect, useCallback } from 'react';

const GridPatternBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const time = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const gridSize = 40;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'hsla(var(--primary-foreground) / 0.05)';
    
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
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      time.current += 1;
      draw(ctx, time.current);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
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
