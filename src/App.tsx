import React, { useState, useRef, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Menu
} from 'lucide-react';
import { FloatingElement } from './components/FloatingElement';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './lib/store';
import { HeroIllustration } from './components/HeroIllustration';

// Lazy load non-critical pages
const Features = lazy(() => import('./pages/Features').then(module => ({ default: module.Features })));
const Solutions = lazy(() => import('./pages/Solutions').then(module => ({ default: module.Solutions })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Pricing = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));
const EmailCampaign = lazy(() => import('./pages/EmailCampaign').then(module => ({ default: module.EmailCampaign })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin text-[#00F0FF]">
      <RefreshCcw className="w-8 h-8" />
    </div>
  </div>
);

function App() {
  const { user } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Prefetch email campaign page
  React.useEffect(() => {
    const prefetchEmailCampaign = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/email-campaign';
      document.head.appendChild(link);
    };
    prefetchEmailCampaign();
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const navItems = [
    { id: '/features', label: 'Features' },
    { id: '/solutions', label: 'Solutions' },
    { id: '/pricing', label: 'Pricing' },
    { id: '/contact', label: 'Contact' }
  ];

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
      content: "Our lead conversion rate increased by 150% within the first month.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    },
    {
      name: "Michael Chen",
      role: "Sales Manager",
      company: "GrowthLabs",
      content: "The AI-powered automation has revolutionized our lead nurturing process.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    },
  ];

  const faqs = [
    {
      question: "How does the AI lead scoring work?",
      answer: "Our AI analyzes multiple data points including engagement metrics, demographic data, and behavioral patterns to automatically score and prioritize leads.",
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer: "Yes, we offer seamless integration with major CRM platforms including Salesforce, HubSpot, and others.",
    },
    {
      question: "How long does it take to see results?",
      answer: "Most customers see significant improvements in lead conversion rates within the first 30 days of implementation.",
    },
  ];

  const renderHome = () => (
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
                <div className="bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
                  AI-Powered Lead
                </div>
                <div className="bg-gradient-to-r from-[#A742FF] to-[#00F0FF] bg-clip-text text-transparent">
                  Nurturing System
                </div>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Automated, Adaptive, Always Learning. Transform your lead conversion process with next-generation AI technology.
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
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
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
                        <Star key={i} className="w-4 h-4 fill-[#00F0FF] text-[#00F0FF]" />
                      ))}
                    </div>
                    <p className="text-lg mb-4">{testimonial.content}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-gradient-to-br from-[#00F0FF]/5 to-[#A742FF]/5 border border-[#00F0FF]/20"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Transform Your Lead Nurturing?</h2>
            <p className="text-xl text-gray-300">
              Join thousands of businesses using AI to automate and optimize their lead conversion process.
            </p>
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-2 px-12 py-6 bg-gradient-to-r from-[#00F0FF] to-[#A742FF] rounded-lg font-semibold text-xl mx-auto hover:scale-105 transition-transform cursor-pointer select-none"
            >
              Get Started Now <Zap className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white">
      <Toaster />
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0D0D1F]/80 border-b border-[#00F0FF]/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <CircuitBoard className="w-8 h-8 text-[#00F0FF]" />
              <span className="font-bold text-xl bg-gradient-to-r from-[#00F0FF] to-[#A742FF] bg-clip-text text-transparent">
                AI Nurture
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(item.id)}
                  className={`relative px-2 py-1 transition-colors ${
                    location.pathname === item.id ? 'text-[#00F0FF]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00F0FF] to-[#A742FF]"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="md:hidden flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={openLoginModal}
              className="hidden md:block px-4 py-2 rounded-lg border border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 transition-colors"
            >
              Sign In
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          className="md:hidden overflow-hidden bg-[#0D0D1F]/95 border-b border-[#00F0FF]/10"
        >
          <div className="container mx-auto px-4 py-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  navigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.id 
                    ? 'bg-gradient-to-r from-[#00F0FF]/10 to-[#A742FF]/10 text-white' 
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
              onClick={() => {
                openLoginModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#A742FF] text-white font-semibold"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </nav>

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/email-campaign" 
            element={
              user ? (
                <EmailCampaign />
              ) : (
                <Navigate to="/" replace state={{ from: location }} />
              )
            } 
          />
        </Routes>
      </Suspense>

      <Footer />

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default App;