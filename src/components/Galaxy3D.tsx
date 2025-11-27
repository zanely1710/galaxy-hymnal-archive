import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  
  const particles = useMemo(() => {
    const temp = [];
    const count = isMobile ? 1500 : 3000; // Reduced from 5000
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [isMobile]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.15}
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
  const isMobile = useIsMobile();
  
  const particles = useMemo(() => {
    const temp = [];
    const count = isMobile ? 800 : 1500; // Reduced from 3000
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [isMobile]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
      ref.current.rotation.z = state.clock.elapsedTime * 0.015;
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
        opacity={0.5}
      />
    </Points>
  );
}


function Nebula() {
  const isMobile = useIsMobile();
  const segments = isMobile ? 16 : 32; // Lower poly count on mobile
  
  return (
    <group>
      <mesh position={[-15, 10, -30]}>
        <sphereGeometry args={[12, segments, segments]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {!isMobile && (
        <>
          <mesh position={[15, -8, -35]} rotation={[0, 0, Math.PI / 3]}>
            <sphereGeometry args={[10, segments, segments]} />
            <meshBasicMaterial
              color="#8b5cf6"
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, 0, -40]}>
            <sphereGeometry args={[15, segments, segments]} />
            <meshBasicMaterial
              color="#ec4899"
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Galaxy3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower pixel ratio on mobile
        performance={{ min: 0.5 }} // Allow quality reduction under load
        frameloop="demand" // Only render when needed
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <Stars />
        <GalaxyDust />
        <Nebula />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
