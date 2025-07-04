'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const CollaborationAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const particles = useRef<any[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 120,
  });

  const Particle = useCallback(function(this: any, x: number, y: number, canvas: HTMLCanvasElement) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 1.5 + 0.5;
    this.vx = Math.random() * 0.4 - 0.2;
    this.vy = Math.random() * 0.4 - 0.2;
    this.color = `hsl(${Math.random() * 30 + 160}, 100%, 70%)`; // Teal/Cyan tones

    this.draw = (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    this.update = (ctx: CanvasRenderingContext2D) => {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x > canvas.width + this.radius || this.x < -this.radius) this.vx = -this.vx;
      if (this.y > canvas.height + this.radius || this.y < -this.radius) this.vy = -this.vy;

       if (mouse.current.x !== null && mouse.current.y !== null) {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.current.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 1.2;
          const directionY = forceDirectionY * force * 1.2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.draw(ctx);
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

        if (distance < (110 * 110)) {
          opacityValue = 1 - (distance / 12100);
          ctx.strokeStyle = `hsla(175, 80%, 60%, ${opacityValue * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles.current[a].x, particles.current[a].y);
          ctx.lineTo(particles.current[b].x, particles.current[b].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const setupAndAnimate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles.current = [];
    const numberOfParticles = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        // @ts-ignore
        particles.current.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, canvas));
    }
    
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => p.update(ctx));
      connect(ctx);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
  }, [Particle, connect]);


  useEffect(() => {
    const handleResize = () => setupAndAnimate();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    const handleMouseOut = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    }

    setupAndAnimate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [setupAndAnimate]);

  return <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default CollaborationAnimation;
