import React from 'react';
import { motion } from 'framer-motion';

const FogOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Pierwsza warstwa mgły - szybka */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
      </motion.div>

      {/* Druga warstwa mgły - wolniejsza */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: ['100%', '-100%']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-[200%] h-full bg-gradient-to-l from-transparent via-white/30 to-transparent blur-xl" />
      </motion.div>

      {/* Unosząca się mgła */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-32 bg-white/20 blur-xl"
          style={{
            bottom: `${i * 15}%`,
          }}
          animate={{
            x: i % 2 === 0 ? ['-100%', '100%'] : ['100%', '-100%'],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            x: {
              duration: 25 + i * 5,
              repeat: Infinity,
              ease: "linear"
            },
            opacity: {
              duration: 3 + i * 2,
              repeat: Infinity,
              yoyo: true
            }
          }}
        />
      ))}

      {/* Dolna warstwa mgły */}
      <div className="absolute bottom-0 w-full h-64">
        <motion.div
          className="w-full h-full bg-gradient-to-t from-white/40 via-white/20 to-transparent blur-lg"
          animate={{
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Pulsująca mgła */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute inset-0"
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-full h-full bg-white/10 blur-2xl"
            style={{
              transform: `scale(${1 + i * 0.2})`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FogOverlay;