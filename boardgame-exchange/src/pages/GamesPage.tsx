import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import { Game } from '../types/game';
import { Search, Filter } from 'lucide-react';

const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'Dungeons & Dragons: Starter Set',
    description: 'Everything you need to start playing the worlds greatest roleplaying game.',
    imageUrl: 'https://placeholder.com/dnd-starter',
    category: 'RPG',
    players: { min: 2, max: 6 },
    playTime: { min: 60, max: 180 },
    difficulty: 'Medium',
    rating: 4.8,
    owner: {
      id: 'user1',
      name: 'John Doe',
      location: 'Warsaw'
    }
  },
  // Dodaj więcej gier...
];

const GamesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleGameClick = (game: Game) => {
    console.log('Game clicked:', game);
  };

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-amber-100">
  
      <div className="relative h-64 bg-cover bg-center" 
           style={{ backgroundImage: 'url("/images/skull-candle-arrangement-still-life.jpg")' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-medieval text-4xl md:text-5xl lg:text-6xl font-bold text-center 
                        text-amber-100 tracking-wider text-shadow-lg">
            Available Games
          </h1>
        </div>
      </div>

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              placeholder="Search for mystical games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2c1810] border border-amber-900/50 rounded-lg
                         text-amber-100 placeholder-amber-700
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         font-cinzel transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="font-medieval flex items-center gap-2 px-6 py-3 
                       bg-gradient-to-r from-amber-900 to-amber-800
                       hover:from-amber-800 hover:to-amber-700
                       text-amber-100 rounded-lg transition-all duration-300
                       hover:shadow-lg hover:shadow-amber-900/50"
          >
            <Filter className="w-5 h-5" />
            Magic Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 bg-[#2c1810] rounded-lg border border-amber-900/30
                      shadow-lg backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filtry */}
              <div className="space-y-3">
                <label className="font-medieval block text-sm text-amber-200">
                  Category of Magic
                </label>
                <select className="w-full p-3 bg-[#1a0f0f] rounded-lg border border-amber-900/50
                                 text-amber-100 font-cinzel focus:ring-2 focus:ring-amber-500">
                  <option value="">All Categories</option>
                  <option value="rpg">RPG Legends</option>
                  <option value="strategy">Strategic Battles</option>
                  <option value="card">Mystical Cards</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="font-medieval block text-sm text-amber-200">
                  Quest Difficulty
                </label>
                <select className="w-full p-3 bg-[#1a0f0f] rounded-lg border border-amber-900/50
                                 text-amber-100 font-cinzel focus:ring-2 focus:ring-amber-500">
                  <option value="">All Challenges</option>
                  <option value="easy">Novice</option>
                  <option value="medium">Adept</option>
                  <option value="hard">Master</option>
                  <option value="expert">Legendary</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-medieval block text-sm text-amber-200">
                  Party Size
                </label>
                <select className="w-full p-3 bg-[#1a0f0f] rounded-lg border border-amber-900/50
                                 text-amber-100 font-cinzel focus:ring-2 focus:ring-amber-500">
                  <option value="">Any Party Size</option>
                  <option value="2">Solo Duo</option>
                  <option value="3-4">Small Party (3-4)</option>
                  <option value="5+">Full Party (5+)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_GAMES.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={handleGameClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;