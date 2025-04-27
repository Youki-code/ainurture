"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  RefreshCcw,
  Zap,
  ArrowRight,
  Database,
  Bot,
  LineChart,
  Mail,
  Star,
  HelpCircle,
  CircuitBoard,
  Menu,
} from "lucide-react";
import { Footer } from "../components/Footer";

export default function Solutions() {
  const solutions = [
    {
      title: "B2B Lead Nurturing",
      description:
        "Perfect for B2B companies looking to automate and optimize their lead nurturing process.",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "E-commerce Marketing",
      description:
        "Boost your e-commerce sales with personalized customer journeys and automated follow-ups.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "SaaS Growth",
      description:
        "Accelerate your SaaS company's growth with intelligent lead scoring and nurturing.",
      icon: <LineChart className="w-8 h-8" />,
    },
    {
      title: "Real Estate",
      description:
        "Convert more leads into clients with our specialized real estate marketing automation.",
      icon: <Database className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10" />

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Solutions</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tailored solutions for your specific industry needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20"
            >
              <div className="text-[#00F0FF] mb-4">{solution.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
              <p className="text-gray-400">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
