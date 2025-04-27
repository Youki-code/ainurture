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

export default function Contact() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10" />

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team to learn more about how we can help your
            business grow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20">
              <h3 className="text-2xl font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF]"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-white/5 border border-[#00F0FF]/20 rounded-lg focus:outline-none focus:border-[#00F0FF] h-32"
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20">
              <h3 className="text-2xl font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-[#00F0FF]" />
                  <span className="text-gray-300">contact@ainurture.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-6 h-6 text-[#00F0FF]" />
                  <span className="text-gray-300">support@ainurture.com</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#A742FF]/10 border border-[#00F0FF]/20">
              <h3 className="text-2xl font-semibold mb-4">Office Location</h3>
              <p className="text-gray-300">
                123 AI Street
                <br />
                Tech City, TC 12345
                <br />
                United States
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
