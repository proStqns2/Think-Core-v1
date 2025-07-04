'use client';

import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Retrowave color palette
  vec3 colorSun = vec3(0.9, 0.4, 0.3);
  vec3 colorGrid = vec3(0.6, 0.2, 0.8);
  vec3 colorSky = vec3(0.1, 0.0, 0.3);

  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }

  void main() {
    // Normalized coordinates with perspective for the floor
    vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
    p.y += 0.6; // Move horizon down

    // Sky gradient
    vec3 col = mix(colorGrid, colorSky, p.y * 1.5 + 0.5);

    // Sun
    vec2 sunPos = vec2(0.0, 0.2);
    float sunDist = sdCircle(p - sunPos, 0.5);
    vec3 sun = colorSun * (1.0 - smoothstep(0.0, 0.01, sunDist));

    // Sun lines (scanlines)
    float sunLines = smoothstep(0.48, 0.5, length(p - sunPos));
    sunLines -= smoothstep(0.5, 0.51, length(p - sunPos));
    float lineSpeed = uTime * 2.0;
    sunLines *= step(0.5, fract( (p.y - sunPos.y + 0.5) * 10.0 + lineSpeed) );
    sun = max(sun, vec3(0.0, 0.0, 0.0) * sunLines); // Carve lines out of sun
    col = max(col, sun);

    // Grid floor
    if (p.y < 0.0) {
        // Perspective transform
        vec3 cam = vec3(0.0, 0.0, -1.0);
        vec3 dir = normalize(vec3(p.x, p.y, 1.0));
        float t = -cam.y / dir.y;
        vec3 floorPos = cam + t * dir;

        // Grid lines with anti-aliasing
        vec2 st = floorPos.xz;
        st.y -= uTime * 0.2; // Move grid towards the camera
        vec2 grid = abs(fract(st * 2.0) - 0.5) / fwidth(st * 2.0);
        float line = min(grid.x, grid.y);

        // Add glow to lines and fade into distance
        vec3 gridColor = colorGrid * (0.1 / line);
        gridColor *= (1.0 - smoothstep(0.0, 10.0, t)); // Fade out
        col += gridColor;
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const RetrowaveGridAnimation: React.FC<{className?: string}> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ antialias: true, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3() },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      const dpr = window.devicePixelRatio || 1;
      renderer.setSize(clientWidth * dpr, clientHeight * dpr);
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height, 1);
      gl.canvas.style.width = `${clientWidth}px`;
      gl.canvas.style.height = `${clientHeight}px`;
    };

    window.addEventListener('resize', resize, false);
    resize();
    
    let animationFrameId: number;
    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (gl.canvas && container && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};

export default RetrowaveGridAnimation;
