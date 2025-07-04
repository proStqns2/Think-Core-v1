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
      char: codeChars[Math.floor(Math.random() * codeChars.length)],
    }));

    // --- Server Rack Setup ---
    const serverWidth = 30;
    const serverSpacing = 20;
    const serverCount = Math.floor(canvas.width / (serverWidth + serverSpacing));
    const servers = Array.from({ length: serverCount }, (_, i) => {
        const x = i * (serverWidth + serverSpacing) + 10;
        const unitCount = 24;
        const lights = Array.from({ length: unitCount * 2 }, (__, j) => ({
            x: x + (j % 2 === 0 ? 8 : serverWidth - 8),
            y: Math.floor(j/2) * 20 + 20 + (Math.random() * 10 - 5),
            state: Math.random() > 0.3,
            blinkSpeed: Math.random() * 0.05 + 0.01,
            color: Math.random() > 0.9 ? `hsl(120, 100%, ${Math.random() * 30 + 50}%)` : `hsl(35, 100%, ${Math.random() * 30 + 50}%)`
        }));
        return { x, lights, unitCount };
    });

    // --- Cable Setup ---
    const cables = Array.from({ length: serverCount * 2 }, () => {
      const startServerIndex = Math.floor(Math.random() * serverCount);
      let endServerIndex = Math.floor(Math.random() * serverCount);
      if (startServerIndex === endServerIndex) {
        endServerIndex = (endServerIndex + 1) % serverCount;
      }

      const startServer = servers[startServerIndex];
      const endServer = servers[endServerIndex];

      if (!startServer || !endServer) return null;

      const startLightIndex = Math.floor(Math.random() * startServer.lights.length);
      const endLightIndex = Math.floor(Math.random() * endServer.lights.length);
      
      const startLight = startServer.lights[startLightIndex];
      const endLight = endServer.lights[endLightIndex];

      if (!startLight || !endLight) return null;
      
      return {
        startX: startLight.x,
        startY: startLight.y,
        endX: endLight.x,
        endY: endLight.y,
        pulse: Math.random(),
        speed: (Math.random() * 0.01) + 0.005,
        color: `hsla(180, 80%, 70%, 0.4)`
      };
    }).filter(c => c !== null) as NonNullable<ReturnType<typeof Array.from<any>[0]>>[];


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
      
      // --- Draw Cables ---
      ctx.lineWidth = 1.5;
      cables.forEach(cable => {
        ctx.strokeStyle = cable.color;
        ctx.beginPath();
        ctx.moveTo(cable.startX, cable.startY);

        const cp1x = cable.startX - 60;
        const cp1y = cable.startY;
        const cp2x = cable.endX + 60;
        const cp2y = cable.endY;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cable.endX, cable.endY);
        ctx.stroke();

        // Animate pulse
        cable.pulse = (cable.pulse + cable.speed) % 1;
        const t = cable.pulse;
        const pX = Math.pow(1 - t, 3) * cable.startX + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * cable.endX;
        const pY = Math.pow(1 - t, 3) * cable.startY + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * cable.endY;

        ctx.fillStyle = 'hsl(180, 100%, 90%)';
        ctx.shadowColor = 'hsl(180, 100%, 90%)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pX, pY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- Draw Server Rack Layer ---
      servers.forEach(server => {
        ctx.fillStyle = 'hsla(25, 10%, 15%, 0.8)';
        ctx.fillRect(server.x, 0, serverWidth, canvas.height);
        
        // Server details (vents)
        ctx.fillStyle = 'hsla(25, 10%, 5%, 0.6)';
        for(let y = 10; y < canvas.height - 10; y += 40) {
            ctx.fillRect(server.x + 5, y, serverWidth - 10, 5);
        }

        ctx.strokeStyle = 'hsla(25, 10%, 5%, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(server.x, 0, serverWidth, canvas.height);

        server.lights.forEach(light => {
          if (frame % Math.floor(1 / light.blinkSpeed) === 0) {
            light.state = !light.state;
          }
          if (light.state) {
            ctx.fillStyle = light.color;
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.fillRect(light.x - 2, light.y - 1, 4, 2); // Make them small rectangles
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
