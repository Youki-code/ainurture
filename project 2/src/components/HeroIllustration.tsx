import React from 'react';
import { motion } from 'framer-motion';

export function HeroIllustration() {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
      {/* Background gradient circles */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-[#00F0FF]/20 to-[#A742FF]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[60%] h-[60%] bg-gradient-to-tr from-[#A742FF]/10 to-[#00F0FF]/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Main illustration elements */}
      <div className="relative h-full flex items-center justify-center">
        {/* Central sphere */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-48 h-48 lg:w-64 lg:h-64"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#A742FF] opacity-20 blur-md" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#A742FF] opacity-40" />
          
          {/* Orbiting elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ rotate: i * 120 }}
              animate={{ rotate: i * 120 + 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00F0FF]"
                style={{ transformOrigin: '50% 50%' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          ))}

          {/* Data streams */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`stream-${i}`}
              className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-[#00F0FF] to-transparent"
              style={{
                transform: `rotate(${i * 72}deg)`,
                transformOrigin: '50% 0',
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </motion.div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-[#00F0FF]"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}