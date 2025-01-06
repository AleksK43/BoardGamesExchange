import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin, Calendar, Star, User, Scroll } from 'lucide-react';
import { format } from 'date-fns';
import type { GameCardData } from '../types/game';
import type { GameReview, ReviewRating } from '../types/review';
import { gameService } from '../services/api';
import { useAuth } from '../providers/AuthProvider';
import { useNotification } from '../providers/NotificationProvider';
import GameReviews from './GameReviews';

interface GameDetailsModalProps {
  game: GameCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [rating, setRating] = useState<ReviewRating>({
    average: 0,
    starsCount_1: 0,
    starsCount_2: 0,
    starsCount_3: 0,
    starsCount_4: 0,
    starsCount_5: 0
  });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!game || !isOpen) return;
  
      try {
        const reviewsResult = await gameService.getGameReviews(Number(game.id));
        setReviews(reviewsResult);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
  
      try {
        const ratingResult = await gameService.getGameRating(Number(game.id));
        setRating(ratingResult);
      } catch (error) {
        console.error('Error fetching rating:', error);
        setRating({
          average: 0,
          starsCount_1: 0,
          starsCount_2: 0,
          starsCount_3: 0,
          starsCount_4: 0,
          starsCount_5: 0
        });
      }
    };

    fetchReviews();
  }, [game, isOpen, showNotification]);

  const handleBorrowRequest = async () => {
    if (!game || !user) return;

    try {
      setIsRequesting(true);
      await gameService.requestBorrow(Number(game.id));
      showNotification('success', 'Borrow request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error requesting borrow:', error);
      showNotification('error', 'Failed to send borrow request');
    } finally {
      setIsRequesting(false);
    }
  };

  if (!game) return null;

  const isOwnGame = user?.id === Number(game.owner.id);

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
              {/* Header Image with ImageSlider */}
              <div className="relative h-96 overflow-hidden rounded-t-xl">
                {game.images && game.images.length > 0 ? (
                  <img
                    src={game.images[0]}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-amber-900/20 to-amber-950/20 
                               flex items-center justify-center">
                    <Scroll className="w-16 h-16 text-amber-500/50" />
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 text-amber-100 hover:text-amber-200 
                           transition-colors bg-gradient-to-r from-amber-900/80 to-amber-800/80
                           p-2 rounded-full border border-amber-500/30
                           hover:from-amber-800/80 hover:to-amber-700/80"
                >
                  <X size={24} />
                </button>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 -mt-12 relative">
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
                        <span className="capitalize">{game.condition}</span>
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
                  <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-900/30">
                    <h4 className="font-medieval text-amber-200 mb-2">Availability</h4>
                    <div className="flex items-center gap-2 text-amber-100/80">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(game.availableFrom), 'd MMM yyyy')} - {' '}
                        {format(new Date(game.availableTo), 'd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-900/30">
                    <h4 className="font-medieval text-amber-200 mb-2">Game Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-100/80">
                        <Star size={16} />
                        <span className="capitalize">Condition: {game.condition}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-100/80">
                        <Users size={16} />
                        <span>Players: {game.numberOfPlayers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-medieval text-amber-200 mb-4">Reviews & Ratings</h3>
                  <GameReviews reviews={reviews} rating={rating} />
                </div>

                {/* Actions */}
                {!isOwnGame && (
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleBorrowRequest}
                      disabled={isRequesting}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                               from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800
                               text-amber-100 rounded-lg transition-colors font-medieval
                               disabled:opacity-50 disabled:cursor-not-allowed
                               border border-amber-500/30"
                    >
                      {isRequesting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-amber-100 border-t-transparent 
                                      rounded-full animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <Scroll size={18} />
                          <span>Request Borrow</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GameDetailsModal;