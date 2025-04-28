"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function SuccessMessage({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
    >
      <CheckCircle className="w-6 h-6 text-green-500" />
      <p className="text-green-500">{message}</p>
    </motion.div>
  );
}
