'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const ServerRackAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const codeChars = '01<>{}/()=+-*&|;'.split('');

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- Rain Setup ---
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => ({
      y: Math.random() * canvas.height,
      char: codeChars[Math.floor(Math.random() * codeChars.length)]
    }));

    // --- Server Rack Setup ---
    const servers = Array.from({ length: Math.floor(canvas.width / 50) }, (_, i) => ({
      x: i * 50 + 10,
      lights: Array.from({ length: 12 }, () => ({
        y: Math.random() * (canvas.height - 40) + 20,
        state: Math.random() > 0.5,
        blinkSpeed: Math.random() * 0.1 + 0.01,
        color: `hsl(35, 100%, ${Math.random() * 30 + 50}%)`
      }))
    }));

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    let frame = 0;
    const draw = () => {
      // --- Draw Rain Layer ---
      ctx.fillStyle = 'rgba(10, 5, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'hsla(30, 80%, 30%, 0.5)';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((drop, i) => {
        const x = i * fontSize;
        ctx.fillText(drop.char, x, drop.y);
        drop.y += fontSize;

        if (drop.y > canvas.height && Math.random() > 0.95) {
          drops[i].y = 0;
          drops[i].char = codeChars[Math.floor(Math.random() * codeChars.length)];
        }
      });

      // --- Draw Server Rack Layer ---
      servers.forEach(server => {
        ctx.fillStyle = 'hsla(25, 10%, 15%, 0.7)';
        ctx.fillRect(server.x, 0, 30, canvas.height);
        
        ctx.strokeStyle = 'hsla(25, 10%, 5%, 0.7)';
        ctx.lineWidth = 2;
        ctx.strokeRect(server.x, 0, 30, canvas.height);

        server.lights.forEach(light => {
          if (frame % Math.floor(1 / light.blinkSpeed) === 0) {
            light.state = !light.state;
          }
          if (light.state) {
            ctx.fillStyle = light.color;
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(server.x + 15, light.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      frame++;
      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();
  }, [codeChars]);

  useEffect(() => {
    const handleResize = () => setupCanvas();
    setupCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [setupCanvas]);

  return <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0, background: '#0a0500' }} />;
};

export default ServerRackAnimation;
