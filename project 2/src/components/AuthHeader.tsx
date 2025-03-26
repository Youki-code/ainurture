import React from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function AuthHeader() {
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!user) return null;

  const firstName = user.displayName.split(' ')[0];

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#A742FF] flex items-center justify-center text-white font-semibold">
            {firstName[0]}
          </div>
        )}
        <span>{firstName}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0D0D1F] border border-[#00F0FF]/20 shadow-lg z-50"
            >
              <div className="p-2">
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-red-400 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}