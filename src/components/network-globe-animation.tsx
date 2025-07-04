'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const NetworkGlobeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  
  const rotation = useRef(0);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const globeRadius = Math.min(canvas.width, canvas.height) * 0.3;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numPoints = 100;
    const points: any[] = [];
    const arcs: any[] = [];

    // Create points on a sphere
    for (let i = 0; i < numPoints; i++) {
        const phi = Math.acos(-1 + (2 * i) / numPoints);
        const theta = Math.sqrt(numPoints * Math.PI) * phi;
        points.push({
            phi: phi,
            theta: theta,
            x: 0, y: 0, z: 0,
            screenX: 0, screenY: 0,
        });
    }

    const project = (point: any, rotationY: number) => {
        const sinPhi = Math.sin(point.phi);
        const cosPhi = Math.cos(point.phi);
        const sinTheta = Math.sin(point.theta + rotationY);
        const cosTheta = Math.cos(point.theta + rotationY);

        point.x = globeRadius * sinPhi * cosTheta;
        point.y = globeRadius * sinPhi * sinTheta;
        point.z = globeRadius * cosPhi;

        // Simple perspective projection
        const perspective = 1.5;
        const scale = perspective / (perspective - point.z / globeRadius);

        point.screenX = centerX + point.x * scale;
        point.screenY = centerY + point.z * scale;
    };
    
    const createArc = () => {
        if (arcs.length > 20) return;
        const p1Index = Math.floor(Math.random() * numPoints);
        let p2Index = Math.floor(Math.random() * numPoints);
        while(p1Index === p2Index) {
            p2Index = Math.floor(Math.random() * numPoints);
        }
        
        arcs.push({
            p1: points[p1Index],
            p2: points[p2Index],
            progress: 0,
            speed: Math.random() * 0.005 + 0.005,
        });
    }

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotation.current += 0.002;

      // Update and draw points
      points.forEach(p => {
        project(p, rotation.current);
        const opacity = (p.y + globeRadius) / (2 * globeRadius);
        if (opacity > 0) { // Only draw front-facing points
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 1.5 * opacity, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(30, 95%, 55%, ${opacity * 0.8})`;
          ctx.fill();
        }
      });
      
      // Draw globe outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(30, 95%, 55%, 0.1)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Create new arcs randomly
      if (Math.random() < 0.1) {
          createArc();
      }

      // Update and draw arcs
      for(let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.progress += arc.speed;

        if (arc.progress >= 1) {
            arcs.splice(i, 1);
            continue;
        }

        const start = arc.p1;
        const end = arc.p2;
        
        // Only draw arcs between front-facing points
        const startOpacity = (start.y + globeRadius) / (2 * globeRadius);
        const endOpacity = (end.y + globeRadius) / (2 * globeRadius);

        if(startOpacity > 0 && endOpacity > 0) {
            const midX = (start.screenX + end.screenX) / 2;
            const midY = (start.screenY + end.screenY) / 2;
            const dist = Math.sqrt(Math.pow(end.screenX - start.screenX, 2) + Math.pow(end.screenY - start.screenY, 2));
            const cpx = midX + (end.screenY - start.screenY) * 0.4;
            const cpy = midY - (end.screenX - start.screenX) * 0.4;

            ctx.beginPath();
            ctx.moveTo(start.screenX, start.screenY);
            ctx.quadraticCurveTo(cpx, cpy, end.screenX, end.screenY);
            ctx.strokeStyle = `hsla(30, 95%, 55%, ${0.6 * (1 - arc.progress)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw glowing head of the arc
            const t = arc.progress;
            const currentX = (1 - t) * (1 - t) * start.screenX + 2 * (1 - t) * t * cpx + t * t * end.screenX;
            const currentY = (1 - t) * (1 - t) * start.screenY + 2 * (1 - t) * t * cpy + t * t * end.screenY;
            
            ctx.beginPath();
            ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'hsl(45, 100%, 75%)';
            ctx.shadowColor = 'hsl(45, 100%, 75%)';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
      }

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

  return <canvas ref={canvasRef} style={{ display: 'block', background: 'transparent' }} />;
};

export default NetworkGlobeAnimation;
