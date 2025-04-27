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

export default function Features() {
  const features = [
    {
      title: "AI-Powered Lead Scoring",
      description:
        "Our advanced AI algorithms analyze multiple data points to automatically score and prioritize leads based on their likelihood to convert.",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Adaptive Campaigns",
      description:
        "Create personalized nurturing campaigns that automatically adapt based on lead behavior and engagement patterns.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Get instant insights into campaign performance with our comprehensive analytics dashboard.",
      icon: <LineChart className="w-8 h-8" />,
    },
    {
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and focus on what matters most - building relationships with your leads.",
      icon: <Bot className="w-8 h-8" />,
    },
    {
      title: "Seamless Integration",
      description:
        "Connect with your favorite tools and platforms through our extensive integration options.",
      icon: <Database className="w-8 h-8" />,
    },
    {
      title: "Continuous Learning",
      description:
        "Our system continuously learns and improves from every interaction to deliver better results over time.",
      icon: <RefreshCcw className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10" />

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Features</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover how our AI-powered platform can transform your lead
            nurturing process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20"
            >
              <div className="text-[#00F0FF] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
