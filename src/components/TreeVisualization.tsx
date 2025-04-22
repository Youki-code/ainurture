import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function TreeVisualization() {
  const controls = useAnimation();
  const treeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const growTree = async () => {
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeOut" }
      });
      
      await controls.start("visible");
    };

    growTree();
  }, []);

  const branchVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const leafVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={treeRef}
        viewBox="0 0 200 200"
        className="w-full h-full max-w-md"
      >
        {/* Tree trunk */}
        <motion.path
          d="M100 180 L100 120"
          stroke="#00F0FF"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={controls}
        />

        {/* Main branches */}
        <motion.g
          variants={branchVariants}
          initial="hidden"
          animate={controls}
        >
          <path
            d="M100 120 L70 90"
            stroke="#00F0FF"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M100 120 L130 90"
            stroke="#00F0FF"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M100 120 L100 80"
            stroke="#00F0FF"
            strokeWidth="3"
            fill="none"
          />
        </motion.g>

        {/* Leaves */}
        <motion.g
          variants={leafVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left side leaves */}
          <circle cx="65" cy="85" r="5" fill="#A742FF" />
          <circle cx="75" cy="75" r="5" fill="#A742FF" />
          
          {/* Right side leaves */}
          <circle cx="135" cy="85" r="5" fill="#A742FF" />
          <circle cx="125" cy="75" r="5" fill="#A742FF" />
          
          {/* Top leaves */}
          <circle cx="100" cy="70" r="5" fill="#A742FF" />
          <circle cx="90" cy="75" r="5" fill="#A742FF" />
          <circle cx="110" cy="75" r="5" fill="#A742FF" />
        </motion.g>
      </svg>
    </div>
  );
}