import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FogOverlay from '../components/FogOverlay';
import { motion } from 'framer-motion';
import AuthModal from '../components/AuthModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/images/background.jpg')"
        }}
      />
      {/* Efekt mgły */}
      <FogOverlay />
      
      {/* Główna zawartość */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="font-medieval text-5xl md:text-7xl lg:text-8xl font-bold text-amber-100 
                       tracking-wider transform hover:scale-105 transition-all duration-300 
                       text-shadow-lg hover:text-shadow-amber">
            BOARD BUDDIES
          </h1>

          <p className="font-cinzel text-xl md:text-2xl text-amber-200/80 max-w-3xl mx-auto 
                     leading-relaxed tracking-wide">
            Trade and discover new adventures in the world of tabletop gaming
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button
              onClick={() => navigate('/app/games')}
              className="font-medieval text-lg sm:text-xl w-full sm:w-auto px-8 py-4 
                       bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700
                       text-amber-100 rounded-lg transform transition-all duration-300
                       hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500
                       shadow-lg hover:shadow-red-600/50 uppercase tracking-wider"
            >
              Explore Games
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="font-medieval text-lg sm:text-xl w-full sm:w-auto px-8 py-4 
                       bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700
                       text-amber-100 rounded-lg transform transition-all duration-300
                       hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500
                       shadow-lg hover:shadow-amber-600/50 uppercase tracking-wider"
            >
              Start Trading
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal autoryzacji */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Dolny panel z efektami */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-t
                     from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full overflow-hidden">
          <motion.div
            animate={{
              x: [-2000, 2000],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-[200vw] h-32 bg-bottom bg-repeat-x filter blur-sm opacity-40"
            style={{
              backgroundImage: "url('/images/fog-layer.png')"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;