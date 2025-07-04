'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const PulsingGridAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const dots = useRef<any[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 120,
  });

  const Dot = useCallback(function(this: any, x: number, y: number, ctx: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.baseRadius = 1.5;
    this.maxRadiusBoost = 5;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.02 + 0.01;
    this.color = `hsl(140, 100%, ${60 + Math.random() * 15}%)`; // Shades of bright green

    this.update = (time: number) => {
      let currentRadius = this.baseRadius;
      let currentOpacity = 0.4;

      // Pulsing effect
      const pulse = (Math.sin(this.angle + time * 0.0005) + 1) / 2;
      currentRadius += pulse * 1.5;

      // Mouse interaction
      if (mouse.current.x !== null && mouse.current.y !== null) {
        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.current.radius) {
          const force = (mouse.current.radius - distance) / mouse.current.radius;
          currentRadius += force * this.maxRadiusBoost;
          currentOpacity += force * 0.5;
        }
      }

      this.draw(currentRadius, currentOpacity);
    };

    this.draw = (radius: number, opacity: number) => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, radius), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));
      ctx.fill();
    };
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    dots.current = [];
    const gridSize = 40;
    for (let x = gridSize / 2; x < rect.width; x += gridSize) {
      for (let y = gridSize / 2; y < rect.height; y += gridSize) {
        // @ts-ignore
        dots.current.push(new Dot(x, y, ctx));
      }
    }
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      dots.current.forEach(d => d.update(time));
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);

  }, [Dot]);


  useEffect(() => {
    const handleResize = () => {
      setupCanvas();
    };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    const handleMouseOut = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    }

    setupCanvas();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [setupCanvas]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', background: '#000500' }} />;
};

export default PulsingGridAnimation;
