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
  vec3 colorSun = vec3(1.0, 0.4, 0.2);
  vec3 colorGrid = vec3(0.8, 0.2, 1.0);
  vec3 colorSky1 = vec3(0.1, 0.0, 0.2);
  vec3 colorSky2 = vec3(0.3, 0.1, 0.4);

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Signed distance function for a box
  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }
  
  // Noise function for mountains
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }

  void main() {
    // Normalized coordinates with perspective for the floor
    vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
    p.y += 0.3; // Move horizon down

    // Sky gradient
    vec3 col = mix(colorSky2, colorSky1, p.y + 0.2);

    // Sun
    vec2 sunPos = vec2(0.0, 0.1);
    float sunDist = length(p - sunPos);
    vec3 sun = colorSun * smoothstep(0.4, 0.38, sunDist);
    
    // Sun scanlines
    float sunLines = smoothstep(0.3, 0.4, sunDist);
    sunLines -= smoothstep(0.4, 0.41, sunDist);
    float lineSpeed = uTime * 3.0;
    sunLines *= step(0.5, fract((p.y - sunPos.y + 0.4) * 15.0 + lineSpeed));
    sun = max(sun, colorSky1 * sunLines * 2.0);
    col = max(col, sun);

    // Mountains using noise
    float mountain = 0.0;
    float mountainSpeed = uTime * 0.02;
    mountain += noise(vec2(p.x * 2.0 + mountainSpeed, 0.0)) * 0.1;
    mountain += noise(vec2(p.x * 5.0 + mountainSpeed, 0.0)) * 0.03;
    mountain = smoothstep(mountain - 0.01, mountain, p.y + 0.1);
    col = mix(col, vec3(0.0, 0.0, 0.0), mountain * 0.7);

    // Cityscape buildings
    for (float i = -4.0; i <= 4.0; i++) {
        float buildingX = i * 0.2;
        float rand = random(vec2(i, 0.0));
        float buildingWidth = 0.08;
        float buildingHeight = 0.1 + rand * 0.3;
        
        vec2 buildingPos = p - vec2(buildingX, -0.05); // Adjust Y to be on horizon
        float building = 1.0 - smoothstep(0.0, 0.005, sdBox(buildingPos, vec2(buildingWidth, buildingHeight)));
        
        vec3 buildingColor = vec3(0.0, 0.0, 0.0); // Dark building silhouette
        
        // Glowing windows
        if (building > 0.5) {
            vec2 windowCoords = buildingPos / vec2(buildingWidth, buildingHeight);
            if (fract(windowCoords.x * 10.0) > 0.3 && fract(windowCoords.y * 20.0) > 0.4) {
                 if (sin(uTime * (1.0 + rand) + i * 10.0) > 0.0) {
                    buildingColor = mix(vec3(0.9, 0.2, 0.5), vec3(0.2, 0.5, 0.9), rand); // Pink/Cyan windows
                 }
            }
        }
        col = mix(col, buildingColor, building * (1.0 - mountain));
    }

    // Grid floor
    if (p.y < -0.1) {
        vec3 cam = vec3(0.0, -0.2, -1.0);
        vec3 dir = normalize(vec3(p.x, p.y, 1.0));
        float t = -cam.y / dir.y;
        vec3 floorPos = cam + t * dir;

        vec2 st = floorPos.xz;
        st.y -= uTime * 0.3;
        vec2 grid = abs(fract(st * 2.5) - 0.5) / fwidth(st * 2.5);
        float line = min(grid.x, grid.y);

        vec3 gridColor = colorGrid * (0.15 / line);
        gridColor *= (1.0 - smoothstep(0.0, 8.0, t));
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
