'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCrystal({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.005 * speed;
        meshRef.current.rotation.y += 0.005 * speed;
    });

    return (
        <Float speed={2 * speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0}
                    metalness={0.5}
                    transmission={0.6}
                    thickness={2}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

function ParticleField() {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null!);

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, []);

    useFrame((state) => {
        mesh.current.rotation.y += 0.0005;
        mesh.current.rotation.x += 0.0002;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#38bdf8"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function CosmicBackground() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'linear-gradient(to bottom, #020617, #0f172a)' }}>
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ParticleField />

                {/* Floating "Icons" (Abstract Crystals) */}
                <FloatingCrystal position={[-4, 2, -2]} color="#3b82f6" speed={0.8} />
                <FloatingCrystal position={[4, -2, -5]} color="#06b6d4" speed={1.2} />
                <FloatingCrystal position={[-3, -3, 0]} color="#8b5cf6" speed={0.5} />
                <FloatingCrystal position={[5, 3, -8]} color="#ec4899" speed={0.9} />

                {/* Fog for depth */}
                <fog attach="fog" args={['#020617', 5, 30]} />
            </Canvas>

            {/* Vignette Overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(circle at center, transparent 0%, rgba(2,6,23,0.8) 100%)'
            }} />

            {/* Noise Overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }} />
        </div>
    );
}
