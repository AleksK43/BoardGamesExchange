import React from 'react';
import { Users, MapPin, Star, Calendar, Shield, Swords } from 'lucide-react';
import { GameCardData } from '../types/game';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';

interface GameCardProps {
  game: GameCardData;
  onClick?: (game: GameCardData) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMM yyyy', { locale: pl });
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Shield className="w-4 h-4" />;
      default:
        return <Swords className="w-4 h-4" />;
    }
  };

  return (
    <div 
      onClick={() => onClick?.(game)}
      className="group relative bg-gradient-to-b from-amber-900/20 to-amber-950/20 
                 rounded-lg overflow-hidden border border-amber-900/30
                 hover:border-amber-500/50 transition-all duration-300 cursor-pointer
                 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.imageUrl || '/placeholder-game.jpg'}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 
                   group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] via-[#1a0f0f]/60 to-transparent" />
        
        {/* Game Info Badges */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Condition Badge */}
            <div className="flex items-center gap-1.5 bg-amber-900/80 backdrop-blur-sm 
                          px-2.5 py-1.5 rounded-full text-amber-100 text-sm font-medieval">
              <Star className="w-4 h-4" />
              <span className="capitalize">{game.condition}</span>
            </div>
            
            {/* Difficulty Badge */}
            <div className="flex items-center gap-1.5 bg-amber-900/80 backdrop-blur-sm 
                          px-2.5 py-1.5 rounded-full text-amber-100 text-sm font-medieval">
              {getDifficultyIcon(game.difficulty)}
              <span className="capitalize">{game.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <h3 className="font-medieval text-xl text-amber-100 leading-tight
                     group-hover:text-amber-400 transition-colors">
          {game.title}
        </h3>

        {/* Description */}
        <p className="font-crimson text-amber-200/70 text-sm line-clamp-2">
          {game.description}
        </p>

        {/* Game Details */}
        <div className="space-y-2 pt-2 border-t border-amber-900/30">
          {/* Players */}
          <div className="flex items-center gap-2 text-amber-300/70">
            <Users className="w-4 h-4" />
            <span className="text-sm font-crimson">{game.numberOfPlayers} players</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-amber-300/70">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-crimson">{game.owner.city}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-amber-300/70">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-crimson">
              {formatDate(game.availableFrom)} - {formatDate(game.availableTo)}
            </span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="pt-3 border-t border-amber-900/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 
                          flex items-center justify-center text-amber-100 font-medieval">
              {game.owner.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm text-amber-100">{game.owner.name}</div>
              <div className="text-xs text-amber-400/70">Game Master</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/20 
                   rounded-lg pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default GameCard;