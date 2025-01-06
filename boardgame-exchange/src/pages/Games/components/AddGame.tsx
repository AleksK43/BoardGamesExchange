import React, { useState } from 'react';
import { PlusCircle, Trash2, Library, Clock, Book } from 'lucide-react';
import GameForm, { GameFormData } from './GameForm'; 
import MyGames from './MyGames';
import TrashGames from './TrashGames';
import BorrowRequests from './BorrowRequests';
import MyBorrowedGames from './MyBorrowedGames';

type ActiveView = 'add' | 'my-games' | 'requests' | 'borrowed' | 'trash';

const AddGame: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('add');

  const handleSubmit = async (data: GameFormData) => {
    try {
      console.log('Submitted data:', data);
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  };

  const menuItems = [
    {
      title: 'Add Game',
      icon: <PlusCircle size={20} />,
      view: 'add' as ActiveView,
      description: 'Add a new game to your collection'
    },
    {
      title: 'My Games',
      icon: <Library size={20} />,
      view: 'my-games' as ActiveView,
      description: 'Manage your game collection'
    },
    {
      title: 'Borrow Requests',
      icon: <Clock size={20} />,
      view: 'requests' as ActiveView,
      description: 'Manage borrow requests for your games'
    },
    {
      title: 'Borrowed Games',
      icon: <Book size={20} />,
      view: 'borrowed' as ActiveView,
      description: 'View and manage games you borrowed'
    },
    {
      title: 'Trash',
      icon: <Trash2 size={20} />,
      view: 'trash' as ActiveView,
      description: 'View deleted games'
    }
  ];

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
      case 'requests':
        return <BorrowRequests />;
      case 'borrowed':
        return <MyBorrowedGames />;
      case 'trash':
        return <TrashGames />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2c1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center gap-2 px-4 py-6 rounded-lg 
                        transition-all duration-300 group ${
                          activeView === item.view
                            ? 'bg-amber-900/50 text-amber-100 border-2 border-amber-500/50'
                            : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                        }`}
            >
              <div className={`transform transition-transform duration-300 
                           ${activeView === item.view ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-medieval text-lg">{item.title}</span>
              <span className="text-xs text-center opacity-60 font-crimson">
                {item.description}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area with Animation */}
        <div className="bg-gradient-to-b from-[#2c1810]/50 to-[#1a0f0f]/50 
                     rounded-lg border border-amber-900/30 p-6 shadow-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AddGame;