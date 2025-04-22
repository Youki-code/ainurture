import React from 'react';
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
import { FloatingElement } from '../components/FloatingElement';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../lib/store';
import { HeroIllustration } from '../components/HeroIllustration';
import { useRouter } from 'next/router';

const Home = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white">
        <Toaster position="top-right" />
        <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        
        {/* 导航栏 */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-2xl font-bold text-[#00F0FF]"
                >
                  AI Nurture
                </button>
              </div>
              
              {/* 桌面导航 */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.id)}
                    className="text-white/80 hover:text-[#00F0FF] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                {user ? (
                  <button
                    onClick={() => router.push('/email-campaign')}
                    className="bg-[#00F0FF] text-black px-4 py-2 rounded-lg hover:bg-[#00E0FF] transition-colors"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="bg-[#00F0FF] text-black px-4 py-2 rounded-lg hover:bg-[#00E0FF] transition-colors"
                  >
                    Get Started
                  </button>
                )}
              </div>

              {/* 移动端菜单按钮 */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white/80 hover:text-[#00F0FF]"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* 移动端菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white/80 hover:text-[#00F0FF]"
                  >
                    {item.label}
                  </button>
                ))}
                {user ? (
                  <button
                    onClick={() => {
                      router.push('/email-campaign');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-[#00F0FF]"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-[#00F0FF]"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* 主要内容 */}
        <main className="pt-16">
          {/* Hero 部分 */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <HeroIllustration />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  AI-Powered Lead Nurturing
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                  Transform your sales pipeline with intelligent automation and personalized engagement
                </p>
                <button
                  onClick={user ? () => router.push('/email-campaign') : openLoginModal}
                  className="bg-[#00F0FF] text-black px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#00E0FF] transition-colors"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                </button>
              </div>
            </div>
          </section>

          {/* 其他部分... */}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home; 