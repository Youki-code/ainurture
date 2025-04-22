import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface HolographicContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function HolographicContainer({ children, className = '' }: HolographicContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 bg-[#1A1A1A] opacity-95" />
      <div className="absolute inset-0 bg-noise opacity-5" />
      <div className="absolute inset-0">
        <Canvas>
          <Environment preset="city" />
          <AccumulativeShadows temporal frames={60} alphaTest={0.85} opacity={0.8}>
            <RandomizedLight amount={8} radius={4} ambient={0.5} position={[5, 5, -10]} />
          </AccumulativeShadows>
          <EffectComposer>
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}