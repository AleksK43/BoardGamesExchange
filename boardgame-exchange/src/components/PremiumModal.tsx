import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Shield, Swords, Scroll, Users, Sparkles } from 'lucide-react';
import { useNotification } from '../providers/NotificationProvider';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumFeature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div className="flex gap-4 p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                  rounded-lg border border-amber-900/30 hover:border-amber-800/50 
                  transition-all duration-300 group">
    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 
                    rounded-full flex items-center justify-center text-amber-100
                    group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="font-medieval text-lg text-amber-100">{title}</h3>
      <p className="text-amber-200/70 font-crimson">{description}</p>
    </div>
  </div>
);

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { showNotification } = useNotification();

  const handleSubscribe = () => {
    showNotification('info', 'Premium subscription system coming soon!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-gradient-to-b from-[#2c1810] to-[#1a0f0f]
                       rounded-xl shadow-xl border border-amber-900/30 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header with Crown */}
              <div className="relative h-40 bg-[url('/images/parchment-texture.jpg')] bg-cover">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 to-[#2c1810]/95">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700
                                  border-4 border-amber-600 shadow-xl flex items-center justify-center">
                      <Crown className="w-8 h-8 text-amber-100" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 
                           transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pt-12 pb-8">
                {/* Title Section */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medieval text-amber-100 mb-3">
                    Ascend to Premium Adventurer
                  </h2>
                  <p className="text-amber-200/70 font-crimson text-lg">
                    Unlock legendary powers and privileges in the realm of Board Buddies
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <PremiumFeature
                    icon={<Shield className="w-6 h-6" />}
                    title="Priority Access"
                    description="First glimpse at newly listed treasures before they're revealed to others"
                  />
                  <PremiumFeature
                    icon={<Swords className="w-6 h-6" />}
                    title="Advanced Matchmaking"
                    description="Enhanced system to find the perfect gaming companions"
                  />
                  <PremiumFeature
                    icon={<Scroll className="w-6 h-6" />}
                    title="Extended Listings"
                    description="Post unlimited games in your collection"
                  />
                  <PremiumFeature
                    icon={<Users className="w-6 h-6" />}
                    title="Special Badge"
                    description="Stand out with a premium adventurer badge on your profile"
                  />
                </div>

                {/* Price Section */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                                rounded-lg border border-amber-900/30 p-4">
                    <div className="text-amber-400 font-medieval text-lg mb-1">Premium Membership</div>
                    <div className="text-3xl font-medieval text-amber-100 mb-2">10 Gold Pieces</div>
                    <div className="text-amber-200/70 font-crimson">per moon cycle (month)</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubscribe}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r 
                             from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 
                             text-amber-100 rounded-lg transition-all duration-300 font-medieval text-lg
                             shadow-lg hover:shadow-amber-900/50 transform hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>Begin Your Premium Journey</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;