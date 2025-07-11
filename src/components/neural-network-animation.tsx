'use client';

import React, { useRef, useEffect, useCallback } from 'react';

// This component is designed to work on a dark background.

const NeuralNetworkAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const particles = useRef<any[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 150,
  });

  const Particle = useCallback(function(this: any, x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.originalColor = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`; // Store original color
    this.color = this.originalColor;

    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    this.update = () => {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
      if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;

      this.color = this.originalColor; // Reset color each frame before mouse check

       // Mouse interaction
       if (mouse.current.x !== null && mouse.current.y !== null) {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.current.radius) {
          this.color = 'hsl(0, 100%, 70%)'; // Change color to red when mouse is near
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.current.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 5; // Increased force
          const directionY = forceDirectionY * force * 5; // Increased force
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.draw();
    };
  }, []);

  const connect = useCallback((ctx: CanvasRenderingContext2D) => {
    let opacityValue = 1;
    for (let a = 0; a < particles.current.length; a++) {
      for (let b = a; b < particles.current.length; b++) {
        const distance =
          (particles.current[a].x - particles.current[b].x) *
            (particles.current[a].x - particles.current[b].x) +
          (particles.current[a].y - particles.current[b].y) *
            (particles.current[a].y - particles.current[b].y);

        if (distance < (100 * 100)) {
          opacityValue = 1 - (distance / 10000);
          ctx.strokeStyle = `rgba(173, 216, 230, ${opacityValue})`; // Light blue lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles.current[a].x, particles.current[a].y);
          ctx.lineTo(particles.current[b].x, particles.current[b].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    particles.current = [];
    const numberOfParticles = (canvas.height * canvas.width) / 4500;
    for (let i = 0; i < numberOfParticles; i++) {
        // @ts-ignore
        particles.current.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, canvas, ctx));
    }
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => p.update());
      connect(ctx);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
  }, [Particle, connect]);


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

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default NeuralNetworkAnimation;
