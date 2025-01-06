import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Save } from 'lucide-react';
import { GameCardData, GameCategory, GameCondition, GameDifficulty } from '../types/game';
import { useNotification } from '../providers/NotificationProvider';
import { gameService } from '../services/api';

interface EditGameModalProps {
  game: GameCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onGameUpdated: () => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onGameUpdated
}) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'board' as GameCategory,
    condition: 'used' as GameCondition,
    numberOfPlayers: 2,
    difficulty: 'medium' as GameDifficulty,
    availableFrom: '',
    availableTo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        description: game.description,
        category: game.category,
        condition: game.condition,
        numberOfPlayers: game.numberOfPlayers,
        difficulty: game.difficulty,
        availableFrom: new Date(game.availableFrom).toISOString().split('T')[0],
        availableTo: new Date(game.availableTo).toISOString().split('T')[0]
      });
    }
  }, [game]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game) return;

    try {
      setIsSubmitting(true);
      await gameService.editGame(Number(game.id), {
        ...formData,
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString()
      });
      showNotification('success', 'Game updated successfully');
      onGameUpdated();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update game';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="w-full max-w-2xl bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] 
                       rounded-xl shadow-xl border border-amber-900/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medieval text-amber-100">Edit Game Details</h2>
                  <button
                    onClick={onClose}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-amber-200 font-medieval mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                               border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-amber-200 font-medieval mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                               border border-amber-900/50 focus:border-amber-500 focus:outline-none
                               min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Category and Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          category: e.target.value as GameCategory 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="board">Board Game</option>
                        <option value="card">Card Game</option>
                        <option value="rpg">RPG</option>
                        <option value="strategy">Strategy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Condition</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          condition: e.target.value as GameCondition 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                  </div>

                  {/* Number of Players and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Number of Players</label>
                      <input
                        type="number"
                        value={formData.numberOfPlayers}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          numberOfPlayers: parseInt(e.target.value) 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          difficulty: e.target.value as GameDifficulty 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  {/* Availability Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Available From</label>
                      <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          availableFrom: e.target.value 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-amber-200 font-medieval mb-2">Available To</label>
                      <input
                        type="date"
                        value={formData.availableTo}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          availableTo: e.target.value 
                        }))}
                        className="w-full bg-amber-900/20 text-amber-100 rounded px-3 py-2
                                 border border-amber-900/50 focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                               from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800
                               text-amber-100 rounded-lg transition-colors font-medieval
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-amber-100 border-t-transparent 
                                      rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditGameModal;