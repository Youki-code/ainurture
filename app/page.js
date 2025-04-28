"use client";

import { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { FloatingElement } from "./components/FloatingElement";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { useAuthStore } from "./lib/store";
import HeroIllustration from "./components/HeroIllustration";

export default function Home() {
  const { user } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const steps = [
    {
      title: "Intelligent Lead Scoring",
      description: "AI analyzes and prioritizes leads automatically",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Adaptive Engagement",
      description: "AI customizes nurturing campaigns based on behavior",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Continuous Optimization",
      description: "Machine learning refines strategies in real time",
      icon: <RefreshCcw className="w-8 h-8" />,
    },
  ];

  const benefits = [
    {
      title: "AI Automation",
      description: "No manual work, just results",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Self-Evolving",
      description: "Learns and improves over time",
      icon: <RefreshCcw className="w-6 h-6" />,
    },
    {
      title: "Seamless Integration",
      description: "Works with your existing CRM",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Data-Driven Decisions",
      description: "AI analytics for smarter engagement",
      icon: <LineChart className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "Our lead conversion rate increased by 150% within the first month.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    },
    {
      name: "Michael Chen",
      role: "Sales Manager",
      company: "GrowthLabs",
      content:
        "The AI-powered automation has revolutionized our lead nurturing process.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    },
  ];

  const faqs = [
    {
      question: "How does the AI lead scoring work?",
      answer:
        "Our AI analyzes multiple data points including engagement metrics, demographic data, and behavioral patterns to automatically score and prioritize leads.",
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer:
        "Yes, we offer seamless integration with major CRM platforms including Salesforce, HubSpot, and others.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Most customers see significant improvements in lead conversion rates within the first 30 days of implementation.",
    },
    {
      question: "Is there a limit to the number of leads I can manage?",
      answer:
        "Our platform scales with your needs. We offer different tiers to accommodate businesses of all sizes.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10" />

      <div className="container mx-auto px-4 pt-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#A742FF]/20 border border-[#00F0FF]/30">
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
                Revolutionary AI Technology
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent"
                >
                  AI-Powered Lead
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-r from-[#A742FF] to-[#00F0FF] bg-clip-text text-transparent"
                >
                  Nurturing System
                </motion.div>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Automated, Adaptive, Always Learning. Transform your lead
                conversion process with next-generation AI technology.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={openLoginModal}
                className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold flex items-center gap-2 relative overflow-hidden group hover:scale-105 transition-transform"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <HeroIllustration />
          </div>
        </div>
      </div>

      <section className="py-20 md:py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#A742FF]/20 border border-[#00F0FF]/30"
              >
                <div className="text-[#00F0FF] mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#00F0FF]/20 to-transparent" />
      </section>

      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20"
              >
                <div className="text-[#00F0FF] mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-2">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-400">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Ready to Transform Your Lead Nurturing?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of businesses that have revolutionized their lead
              conversion process with AI Nurture.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openLoginModal}
              className="px-8 py-4 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold flex items-center gap-2 mx-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      <Footer />

      {isLoginModalOpen && (
        <AuthModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
