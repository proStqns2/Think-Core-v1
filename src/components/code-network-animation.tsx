'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}()/*&%$#@!';

const CodeNetworkAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const particles = useRef<any[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 150,
  });

  // Particle constructor
  const Particle = useCallback(function(this: any, x: number, y: number, canvas: HTMLCanvasElement) {
    this.x = x;
    this.y = y;
    this.char = characters.charAt(Math.floor(Math.random() * characters.length));
    this.fontSize = 12;
    this.vx = Math.random() * 0.6 - 0.3;
    this.vy = Math.random() * 0.6 - 0.3;
    this.color = `hsl(${Math.random() * 30 + 15}, 100%, 70%)`; // Orange/yellow tones

    this.draw = (ctx: CanvasRenderingContext2D) => {
      ctx.font = `${this.fontSize}px monospace`;
      ctx.fillStyle = this.color;
      ctx.fillText(this.char, this.x, this.y);
    };

    this.update = (ctx: CanvasRenderingContext2D) => {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x > canvas.width + this.fontSize || this.x < -this.fontSize) this.vx = -this.vx;
      if (this.y > canvas.height + this.fontSize || this.y < -this.fontSize) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.current.x !== null && mouse.current.y !== null) {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.current.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
      this.draw(ctx);
    };
  }, []);

  // Function to connect particles with lines
  const connect = useCallback((ctx: CanvasRenderingContext2D) => {
    let opacityValue = 1;
    for (let a = 0; a < particles.current.length; a++) {
      for (let b = a; b < particles.current.length; b++) {
        const distance =
          (particles.current[a].x - particles.current[b].x) *
            (particles.current[a].x - particles.current[b].x) +
          (particles.current[a].y - particles.current[b].y) *
            (particles.current[a].y - particles.current[b].y);

        if (distance < (120 * 120)) { // Increased distance for more lines
          opacityValue = 1 - (distance / 14400);
          ctx.strokeStyle = `hsla(30, 100%, 50%, ${opacityValue * 0.5})`; // More subtle orange lines
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles.current[a].x, particles.current[a].y);
          ctx.lineTo(particles.current[b].x, particles.current[b].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  // Main setup and animation loop
  const setupAndAnimate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Sizing
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle creation
    particles.current = [];
    const numberOfParticles = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        // @ts-ignore
        particles.current.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, canvas));
    }

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    const animate = () => {
      // Use a semi-transparent fill to create a trailing effect
      ctx.fillStyle = 'rgba(10, 5, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(p => p.update(ctx));
      connect(ctx);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
  }, [Particle, connect]);


  useEffect(() => {
    const handleResize = () => {
      setupAndAnimate();
    };
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

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [setupAndAnimate]);

  return <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0, background: '#0a0500' }} />;
};

export default CodeNetworkAnimation;
