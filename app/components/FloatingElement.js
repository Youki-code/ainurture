"use client";

import { motion } from "framer-motion";

export function FloatingElement({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
