import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin, Calendar, Star, User, MessageCircle } from 'lucide-react';
import { GameCardData } from '../types/game';
import { format } from 'date-fns';

interface GameDetailsModalProps {
  game: GameCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onContactOwner?: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose,
  onContactOwner
}) => {
  if (!game) return null;

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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] 
                       rounded-xl shadow-xl border border-amber-900/30 max-h-[90vh] 
                       overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img
                  src={game.imageUrl || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-amber-100 hover:text-amber-200 
                           transition-colors bg-black/20 p-2 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-medieval text-amber-100 mb-2">
                      {game.title}
                    </h2>
                    <div className="flex items-center gap-4 text-amber-300/80">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{game.numberOfPlayers} players</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>{game.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-amber-100">
                      <MapPin size={16} />
                      <span>{game.owner.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-100/70 text-sm mt-1">
                      <User size={14} />
                      <span>{game.owner.name}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-medieval text-amber-200 mb-2">About the Game</h3>
                  <p className="text-amber-100/80 font-crimson text-lg">
                    {game.description}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-900/20 rounded-lg p-4">
                    <h4 className="font-medieval text-amber-200 mb-2">Availability</h4>
                    <div className="flex items-center gap-2 text-amber-100/80">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(game.availableFrom), 'd MMM yyyy')} - {' '}
                        {format(new Date(game.availableTo), 'd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-900/20 rounded-lg p-4">
                    <h4 className="font-medieval text-amber-200 mb-2">Condition</h4>
                    <div className="flex items-center gap-2 text-amber-100/80">
                      <Star size={16} />
                      <span className="capitalize">{game.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={onContactOwner}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                             from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800
                             text-amber-100 rounded-lg transition-colors font-medieval"
                  >
                    <MessageCircle size={18} />
                    <span>Contact Owner</span>
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

export default GameDetailsModal;