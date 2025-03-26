import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export function EnergyLines() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-[#6A0DAD] to-transparent"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: "200%",
            opacity: [0, 1, 0],
            transition: {
              repeat: Infinity,
              duration: 3,
              delay: i * 0.5,
              ease: "linear"
            }
          }}
          style={{
            top: `${20 + i * 15}%`,
            width: "100%"
          }}
        />
      ))}
    </div>
  );
}