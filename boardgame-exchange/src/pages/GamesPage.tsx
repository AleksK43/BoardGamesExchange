import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import { Game } from '../types/game';
import { Search, Filter } from 'lucide-react'; // Usunięto nieużywaną ikonę SlidersHorizontal

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
    // Implementacja szczegółów gry
    console.log('Game clicked:', game);
  };

  return (
    <div className="min-h-screen bg-rpg-dark text-white">
      {/* Hero section */}
      <div className="relative h-64 bg-cover bg-center" 
           style={{ backgroundImage: 'url("/images/games-hero.jpg")' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Available Games
          </h1>
        </div>
      </div>

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-900 rounded-lg
                       hover:bg-amber-800 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-4 bg-gray-900 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtry */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <option value="">All Categories</option>
                  <option value="rpg">RPG</option>
                  <option value="strategy">Strategy</option>
                  <option value="card">Card Games</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Difficulty
                </label>
                <select className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Players
                </label>
                <select className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <option value="">Any Number</option>
                  <option value="2">2 Players</option>
                  <option value="3-4">3-4 Players</option>
                  <option value="5+">5+ Players</option>
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