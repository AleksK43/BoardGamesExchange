import React from 'react';
import GameForm from './GameForm';
import MyGames from './MyGames';
import { PlusCircle, Trash2, Library } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface GameFormData {
  title: string;
  description?: string;
  condition: 'new' | 'used' | 'damaged';
  category: string;
  images: File[];
}

const AddGame: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: 'Add Game',
      icon: <PlusCircle size={20} />,
      path: '/app/games/add'
    },
    {
      title: 'My Games',
      icon: <Library size={20} />,
      path: '/app/games/my-games'
    },
    {
      title: 'Trash',
      icon: <Trash2 size={20} />,
      path: '/app/games/trash'
    }
  ];

  const handleSubmit = async (data: GameFormData) => {
    try {
      // TODO: Implement API call
      console.log('Submitted data:', data);
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/app/games/add':
        return (
          <>
            <h1 className="text-2xl font-medieval text-amber-100 mb-8">
              Add New Game
            </h1>
            <GameForm onSubmit={handleSubmit} />
          </>
        );
      case '/app/games/my-games':
        return <MyGames />;
      case '/app/games/trash':
        return <h1 className="text-2xl font-medieval text-amber-100 mb-8">Kosz</h1>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2c1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                        font-medieval text-lg ${
                          currentPath === item.path
                            ? 'bg-amber-900/50 text-amber-100 border-2 border-amber-500/50'
                            : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                        }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AddGame;