import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '../types/game';
import { Star, Users, Clock, MapPin } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-rpg-dark rounded-lg overflow-hidden shadow-lg hover:shadow-2xl 
                 transition-all duration-300 cursor-pointer border border-amber-900/20"
      onClick={() => onClick(game)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 
                     hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-white">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{game.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-amber-100 mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Users className="w-4 h-4" />
            <span>{game.players.min}-{game.players.max} Players</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Clock className="w-4 h-4" />
            <span>{game.playTime.min}-{game.playTime.max} min</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{game.owner.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs ${
            game.difficulty === 'Easy' ? 'bg-green-900/50 text-green-200' :
            game.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-200' :
            game.difficulty === 'Hard' ? 'bg-red-900/50 text-red-200' :
            'bg-purple-900/50 text-purple-200'
          }`}>
            {game.difficulty}
          </span>
          <span className="text-amber-500 text-sm">{game.category}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;