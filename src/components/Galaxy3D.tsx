import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function GalaxyDust() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
      ref.current.rotation.y = -state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#fbbf24"
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

export default function Galaxy3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Stars />
        <GalaxyDust />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80 pointer-events-none" />
    </div>
  );
}
