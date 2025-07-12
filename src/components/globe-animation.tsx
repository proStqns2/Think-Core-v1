'use client';

import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeAnimation: React.FC = () => {
  const globeEl = useRef<any>();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ z: 300 });
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundColor="rgba(0,0,0,0)"
      width={600}
      height={600}
    />
  );
};

export default GlobeAnimation;
