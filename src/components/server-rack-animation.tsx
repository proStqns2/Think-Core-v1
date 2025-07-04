'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const ServerRackAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const servers = Array.from({ length: Math.floor(canvas.width / 60) }, (_, i) => ({
      x: i * 60 + 10,
      lights: Array.from({ length: 10 }, () => ({
        y: Math.random() * (canvas.height - 40) + 20,
        state: Math.random() > 0.5,
        blinkSpeed: Math.random() * 0.1 + 0.01,
        color: `hsl(25, 100%, ${Math.random() * 20 + 40}%)`
      }))
    }));

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      servers.forEach(server => {
        // Draw server rack
        ctx.fillStyle = 'hsla(210, 10%, 15%, 0.8)';
        ctx.fillRect(server.x, 0, 40, canvas.height);

        // Draw lights
        server.lights.forEach(light => {
          if (frame % Math.floor(1 / light.blinkSpeed) === 0) {
            light.state = !light.state;
          }
          if (light.state) {
            ctx.fillStyle = light.color;
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(server.x + 20, light.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      frame++;
      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();
  }, []);

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

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default ServerRackAnimation;
