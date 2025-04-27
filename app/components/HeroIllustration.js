"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/20 to-[#A742FF]/20 rounded-lg blur-3xl" />
      <div className="relative p-8 rounded-lg bg-black/20 border border-[#00F0FF]/20">
        <div className="aspect-square w-full max-w-md mx-auto">
          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
}
