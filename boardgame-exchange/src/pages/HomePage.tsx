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
      {/* Tło z obrazem planszówki */}
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
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-wider">
            BOARD GAME EXCHANGE
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Trade and discover new adventures in the world of tabletop gaming
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
  onClick={() => navigate('/app/games')} // Zmieniona ścieżka
  className="w-full sm:w-auto px-8 py-4 bg-red-900 hover:bg-red-800 
             text-white rounded-lg transform transition-all duration-200 
             hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 
             shadow-lg hover:shadow-red-500/50"
>
  EXPLORE GAMES
</button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-800 
                       text-white rounded-lg transform transition-all duration-200 
                       hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 
                       shadow-lg hover:shadow-amber-500/50"
            >
              START TRADING
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