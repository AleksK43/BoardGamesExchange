import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  isNavigating: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, isNavigating }) => {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={isNavigating ? 'transition' : 'content'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            scale: isNavigating ? 1 : 0.8,
            y: isNavigating ? 0 : -100,
            opacity: 0,
            borderRadius: '50%',
          },
          animate: {
            scale: 1,
            y: 0,
            opacity: 1,
            borderRadius: 0,
            transition: {
              type: "spring",
              stiffness: 50,
              damping: 20,
              duration: 0.8
            }
          },
          exit: {
            scale: 0.8,
            y: -100,
            opacity: 0,
            borderRadius: '50%',
            transition: {
              type: "spring",
              stiffness: 50,
              damping: 20,
              duration: 0.8
            }
          }
        }}
        className="min-h-screen bg-parchment relative origin-top"
      >
        {/* Efekt cienia przy zwijaniu */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          variants={{
            initial: { opacity: 0 },
            animate: { 
              opacity: 0,
              transition: { duration: 0.5 }
            },
            exit: { 
              opacity: 0.4,
              transition: { duration: 0.5 }
            }
          }}
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0,0,0,0.5) 0%, transparent 75%)'
          }}
        />

        {/* Efekt przewijania */}
        <motion.div
          className="absolute inset-0 origin-top"
          variants={{
            initial: { scaleY: 0 },
            animate: { 
              scaleY: 1,
              transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
                duration: 0.8
              }
            },
            exit: { 
              scaleY: 0,
              transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
                duration: 0.8
              }
            }
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;