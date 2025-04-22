import React from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitBoard, Menu } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { AuthHeader } from './AuthHeader';
import { AuthModal } from './AuthModal';

interface NavItem {
  id: string;
  label: string;
}

export function Navigation() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: NavItem[] = [
    { id: '/', label: 'Home' },
    { id: '/features', label: 'Features' },
    { id: '/solutions', label: 'Solutions' },
    { id: '/pricing', label: 'Pricing' },
    { id: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0D0D1F]/80 border-b border-[#00F0FF]/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/')}
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
                  onClick={() => router.push(item.id)}
                  className={`relative px-2 py-1 transition-colors ${
                    router.pathname === item.id ? 'text-[#00F0FF]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {router.pathname === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00F0FF] to-[#A742FF]"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </div>

              {user ? (
                <AuthHeader />
              ) : (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:block px-4 py-2 rounded-lg border border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 transition-colors"
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
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
                      router.push(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      router.pathname === item.id 
                        ? 'bg-gradient-to-r from-[#00F0FF]/10 to-[#A742FF]/10 text-white' 
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {!user && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#A742FF] text-white font-semibold"
                  >
                    Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}