"use client";

import Link from "next/link";
import {
  CircuitBoard,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  // Navigation links for quick access
  const quickLinks = [
    { label: "Products", path: "/features" },
    { label: "Solutions", path: "/solutions" },
    { label: "Resources", path: "#resources" },
    { label: "Pricing", path: "/pricing" },
  ];

  // Help & Support links
  const helpLinks = [
    { label: "Help Center", href: "#help" },
    { label: "Documentation", href: "#docs" },
    { label: "Contact Support", href: "#support" },
  ];

  // Social media links with icons
  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
  ];

  // Contact information
  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "123 AI Street, Tech Valley, CA 94025",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "contact@ainurture.com",
    },
  ];

  return (
    <footer className="bg-[#0D0D1F]/95 border-t border-[#00F0FF]/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 pb-12 border-b border-[#00F0FF]/10">
          {/* Company Info */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <CircuitBoard className="w-8 h-8 text-[#00F0FF]" />
              <span className="font-bold text-xl bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
                AI Nurture
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Transform your lead nurturing process with next-generation AI
              technology. Automated, adaptive, and always learning.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/5 border border-[#00F0FF]/20 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Products & Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.path}
                      className="text-gray-400 hover:text-[#00F0FF] transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <ul className="space-y-3">
                {helpLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#00F0FF] transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                {contactInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="text-[#00F0FF] mt-1">{info.icon}</div>
                    <div>
                      <p className="text-sm text-gray-400">{info.label}</p>
                      <p className="text-white">{info.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} AI Nurture. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a
              href="#privacy"
              className="text-sm text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#cookies"
              className="text-sm text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
