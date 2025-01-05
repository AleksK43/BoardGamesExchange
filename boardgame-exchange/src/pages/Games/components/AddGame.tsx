import React, { useState } from 'react';
import { PlusCircle, Trash2, Library } from 'lucide-react';
import GameForm from './GameForm';
import MyGames from './MyGames';
import TrashGames from './TrashGames';

interface GameFormData {
  title: string;
  description?: string;
  condition: 'new' | 'used' | 'damaged';
  category: string;
  images: File[];
}

type ActiveView = 'add' | 'my-games' | 'trash';

const AddGame: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('add');

  const handleSubmit = async (data: GameFormData) => {
    try {
      // TODO: Implement API call
      console.log('Submitted data:', data);
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'add':
        return (
          <>
            <h1 className="text-2xl font-medieval text-amber-100 mb-8">Add New Game</h1>
            <GameForm onSubmit={handleSubmit} />
          </>
        );
      case 'my-games':
        return <MyGames />;
      case 'trash':
        return <TrashGames />;
      default:
        return null;
    }
  };

  const menuItems = [
    {
      title: 'Add Game',
      icon: <PlusCircle size={20} />,
      view: 'add' as ActiveView
    },
    {
      title: 'My Games',
      icon: <Library size={20} />,
      view: 'my-games' as ActiveView
    },
    {
      title: 'Trash',
      icon: <Trash2 size={20} />,
      view: 'trash' as ActiveView
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2c1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                        font-medieval text-lg ${
                          activeView === item.view
                            ? 'bg-amber-900/50 text-amber-100 border-2 border-amber-500/50'
                            : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                        }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AddGame;