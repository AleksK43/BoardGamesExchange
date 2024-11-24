import React, { useState } from 'react';
import { Filter, Edit2, Trash2, Dice1 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  category: string;
  condition: 'new' | 'used' | 'damaged';
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

const MyGames: React.FC = () => {
  const [games] = useState<Game[]>([
    {
      id: '1',
      title: 'Wiedźmin 3',
      category: 'RPG',
      condition: 'used',
      description: 'Gra w dobrym stanie',
      imageUrl: '/games/witcher.jpg',
      createdAt: new Date()
    }
  ]);

  return (
    <div className="space-y-6 bg-[#2c1810]/50 rounded-lg p-6 border border-amber-900/30">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medieval text-amber-100">
          My Games
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 
                       bg-gradient-to-r from-amber-900/50 to-amber-800/50
                       hover:from-amber-800/50 hover:to-amber-700/50
                       text-amber-100 rounded-lg transition-colors font-medieval">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div 
            key={game.id}
            className="bg-amber-900/20 rounded-lg overflow-hidden border border-amber-500/30
                     hover:border-amber-500 transition-all duration-300 group"
          >
            <div className="relative aspect-video">
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-900/30">
                  <Dice1 size={40} className="text-amber-500/50" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 
                           group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2 bg-amber-900/80 rounded-full 
                           hover:bg-amber-800 transition-colors"
                >
                  <Edit2 size={16} className="text-amber-100" />
                </button>
                <button
                  className="p-2 bg-red-900/80 rounded-full 
                           hover:bg-red-800 transition-colors"
                >
                  <Trash2 size={16} className="text-amber-100" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-medieval text-lg text-amber-100">
                {game.title}
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-amber-400">{game.category}</span>
                <span className="text-amber-400">
                  Stan: {game.condition === 'new' ? 'Nowa' : 'Używana'}
                </span>
              </div>
              <p className="text-amber-200/70 text-sm line-clamp-2">
                {game.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-amber-400 font-medieval text-lg mb-4">
            You don't have any games yet
          </p>
          <Link
            to="/app/games/add"
            className="inline-flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-amber-600 to-amber-700
                     hover:from-amber-700 hover:to-amber-800
                     text-amber-100 rounded-lg transition-colors font-medieval"
          >
            <Dice1 size={20} />
            <span>Add your first game</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGames;