import React from 'react';
import { Users, MapPin, Star, Calendar, Shield, Swords } from 'lucide-react';
import { GameCardData } from '../types/game';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import ImageSlider from './ImageSlider';

interface GameCardProps {
  game: GameCardData;
  onClick?: (game: GameCardData) => void;
}

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

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      onClick={() => onClick?.(game)}
      className="group relative bg-gradient-to-b from-amber-900/20 to-amber-950/20 
                 rounded-lg overflow-hidden border border-amber-900/30
                 hover:border-amber-500/50 transition-all duration-300 cursor-pointer
                 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/20"
    >
      {/* Image Container with ImageSlider */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageSlider 
          images={game.images} 
          className="absolute inset-0"
        />
        
        {/* Game Info Badges */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <div className="flex flex-wrap items-center gap-2">
            {/* Condition Badge */}
            <div className="flex items-center gap-1.5 bg-amber-900/80 backdrop-blur-sm 
                          px-2.5 py-1.5 rounded-full text-amber-100 text-sm font-medieval
                          border border-amber-500/30">
              <Star className="w-4 h-4" />
              <span className="capitalize">{game.condition}</span>
            </div>
            
            {/* Difficulty Badge */}
            <div className="flex items-center gap-1.5 bg-amber-900/80 backdrop-blur-sm 
                          px-2.5 py-1.5 rounded-full text-amber-100 text-sm font-medieval
                          border border-amber-500/30">
              {getDifficultyIcon(game.difficulty)}
              <span className="capitalize">{game.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col h-[380px]">
        {/* Title */}
        <h3 className="font-medieval text-lg text-amber-100 leading-tight
                     group-hover:text-amber-400 transition-colors line-clamp-1 mb-3">
          {game.title}
        </h3>

        {/* Description with fixed height */}
        <div className="h-14 mb-3">
          <p className="font-crimson text-amber-200/70 text-xs line-clamp-2">
            {game.description}
          </p>
        </div>

        {/* Game Details with flex-grow to push content to bottom */}
        <div className="flex-grow">
          <div className="space-y-1 pt-2 border-t border-amber-900/30">
            {/* Players */}
            <div className="flex items-center gap-2 text-amber-300/70">
              <Users className="w-3 h-3" />
              <span className="text-xs font-crimson">{game.numberOfPlayers} players</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-amber-300/70">
              <MapPin className="w-3 h-3" />
              <span className="text-xs font-crimson">{game.owner.city}</span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-amber-300/70">
              <Calendar className="w-3 h-3" />
              <span className="text-[10px] font-crimson">
                {formatDate(game.availableFrom)} - {formatDate(game.availableTo)}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="pt-2 border-t border-amber-900/30 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 
                          flex items-center justify-center text-amber-100 font-medieval
                          border border-amber-500/30 flex-shrink-0 text-xs">
              {game.owner.name.charAt(0)}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs text-amber-100 leading-tight">{game.owner.name}</div>
              <div className="text-[10px] text-amber-400/70 leading-tight">Game Master</div>
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