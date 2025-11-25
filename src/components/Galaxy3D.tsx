import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const [twinkle, setTwinkle] = useState(0);
  
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
      // Twinkling effect
      setTwinkle(Math.sin(state.clock.getElapsedTime() * 2) * 0.3 + 0.7);
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
        opacity={twinkle}
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
        opacity={0.5}
      />
    </Points>
  );
}

function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const [stars] = useState(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
    }))
  );

  return (
    <group ref={groupRef}>
      {stars.map((star) => (
        <ShootingStar key={star.id} delay={star.delay} />
      ))}
    </group>
  );
}

function ShootingStar({ delay }: { delay: number }) {
  const meshRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null);
  const trailRef = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>(null);

  useFrame((state) => {
    if (!meshRef.current || !trailRef.current) return;
    
    const time = state.clock.getElapsedTime() - delay;
    
    if (time > 0 && time % 8 < 2) {
      const progress = (time % 8) / 2;
      meshRef.current.position.x = -20 + progress * 40;
      meshRef.current.position.y = 15 - progress * 30;
      meshRef.current.position.z = -10;
      meshRef.current.material.opacity = Math.sin(progress * Math.PI) * 0.8;
      trailRef.current.material.opacity = Math.sin(progress * Math.PI) * 0.6;
    } else {
      meshRef.current.material.opacity = 0;
      trailRef.current.material.opacity = 0;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={trailRef} position={[-0.5, 0, 0]}>
        <boxGeometry args={[2, 0.05, 0.05]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Nebula() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={[-15, 10, -30]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[15, -8, -35]} rotation={[0, 0, Math.PI / 3]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, -40]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Galaxy3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <Stars />
        <GalaxyDust />
        <ShootingStars />
        <Nebula />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
