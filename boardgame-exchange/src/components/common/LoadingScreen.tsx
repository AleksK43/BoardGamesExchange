import React from 'react';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none' 
      }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0f]/90 backdrop-blur-sm"
    >
      <div className="text-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block text-amber-500 mb-4"
        >
          <Dices size={48} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-amber-100 font-medieval"
        >
          <div className="text-xl mb-2">Loading Next Adventure</div>
          <div className="text-amber-400/70 text-sm">Rolling the dice of destiny...</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;