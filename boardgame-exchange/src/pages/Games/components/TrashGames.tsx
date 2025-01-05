import React from 'react';
import { Trash2 } from 'lucide-react';

const TrashGames: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] rounded-lg p-6 border border-amber-900/30">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="text-amber-500" size={24} />
          <h1 className="text-2xl font-medieval text-amber-100">Deleted Games</h1>
        </div>
        
        {/* Treść */}
        <div className="text-amber-100/80">
          <p>Here you'll find your deleted games. They can be restored within 30 days of deletion.</p>
        </div>
      </div>
    </div>
  );
};

export default TrashGames;