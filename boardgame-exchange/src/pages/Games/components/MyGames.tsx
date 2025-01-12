import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Scroll, PlusCircle } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider';
import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { gameService } from '../../../services/api';
import GameCard from '../../../components/GameCard';
import GameDetailsModal from '../../../components/GameDetailsModal';
import EditGameModal from '../../../components/EditGameModal';
import { Game, GameCardData } from '../../../types/game';
import { useNavigate, Link } from 'react-router-dom';

const MyGames: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const [games, setGames] = useState<GameCardData[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameCardData | null>(null);
  const [isGameDetailsOpen, setIsGameDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const mapToGameCardData = async (game: Game): Promise<GameCardData> => {
    try {
      const gameImages = await gameService.getGameImages(game.id);
      const imageUrls = gameImages.map(img => img.data);

      return {
        id: game.id.toString(),
        title: game.title,
        description: game.description,
        images: imageUrls, 
        category: game.category || 'board',
        difficulty: game.difficulty || 'medium',
        condition: game.condition,
        numberOfPlayers: game.numberOfPlayers,
        availableFrom: game.availableFrom,
        availableTo: game.availableTo,
        owner: {
          id: game.owner.id.toString(),
          name: `${game.owner.firstname} ${game.owner.lastname}`.trim() || 'Anonymous',
          city: game.owner.city || 'Unknown location'
        }
      };
    } catch (error) {
      console.error('Error fetching game images:', error);
      return {
        id: game.id.toString(),
        title: game.title,
        description: game.description,
        images: [], 
        category: game.category || 'board',
        difficulty: game.difficulty || 'medium',
        condition: game.condition,
        numberOfPlayers: game.numberOfPlayers,
        availableFrom: game.availableFrom,
        availableTo: game.availableTo,
        owner: {
          id: game.owner.id.toString(),
          name: `${game.owner.firstname} ${game.owner.lastname}`.trim() || 'Anonymous',
          city: game.owner.city || 'Unknown location'
        }
      };
    }
  };

  const fetchUserGames = useCallback(async () => {
    if (!user) return;
    
    try {
      startLoading();
      const response = await gameService.getAllGames();
      const userGames = response.filter(game => game.owner.id === user.id);
      const mappedGamesPromises = userGames.map(mapToGameCardData);
      const mappedGames = await Promise.all(mappedGamesPromises);
      setGames(mappedGames);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      showNotification('error', 'Failed to load your magical collection');
    } finally {
      stopLoading();
    }
  }, [user, startLoading, stopLoading, showNotification]);

  useEffect(() => {
    fetchUserGames();
  }, [fetchUserGames]);

  const handleGameClick = (game: GameCardData) => {
    setSelectedGame(game);
    setIsGameDetailsOpen(true);
  };

  const handleEdit = (game: GameCardData) => {
    setSelectedGame(game);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (game: GameCardData) => {
    if (window.confirm('Are you sure you want to remove this game from your collection?')) {
      try {
        await gameService.deleteGame(Number(game.id));
        showNotification('success', 'Game successfully removed from your collection');
        fetchUserGames();
      } catch (error) {
        console.error('Failed to remove game:', error);
        showNotification('error', 'Failed to remove game');
      }
    }
  };

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Scroll className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-medieval text-amber-100 mb-4">
          Your Magical Collection is Empty
        </h2>
        <p className="text-amber-200/70 font-crimson text-lg mb-6">
          Begin your journey by adding your first game to your collection.
        </p>
        <button 
          onClick={() => navigate('/app/games/manage/add')}
          className="inline-flex items-center gap-2 px-4 py-2 
                   bg-gradient-to-r from-amber-600 to-amber-700
                   hover:from-amber-700 hover:to-amber-800
                   text-amber-100 rounded-lg transition-colors font-medieval
                   shadow-lg hover:shadow-amber-900/50"
        >
          <PlusCircle size={18} />
          <span>Add New Treasure</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medieval text-amber-100">
          Your Magical Collection
        </h1>
        <Link
          to="/app/games/add"
          className="inline-flex items-center gap-2 px-4 py-2 
                   bg-gradient-to-r from-amber-600 to-amber-700
                   hover:from-amber-700 hover:to-amber-800
                   text-amber-100 rounded-lg transition-colors font-medieval
                   shadow-lg hover:shadow-amber-900/50"
        >
          <PlusCircle size={18} />
          <span>Add New Treasure</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.id} className="relative group">
            <GameCard
              game={game}
              onClick={() => handleGameClick(game)}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 
                         group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(game);
                }}
                className="p-2 bg-amber-900/80 rounded-full 
                         hover:bg-amber-800 transition-colors
                         text-amber-100"
                title="Edit game"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(game);
                }}
                className="p-2 bg-red-900/80 rounded-full 
                         hover:bg-red-800 transition-colors
                         text-amber-100"
                title="Remove game"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <GameDetailsModal
        game={selectedGame}
        isOpen={isGameDetailsOpen}
        onClose={() => setIsGameDetailsOpen(false)}
      />

      <EditGameModal
        game={selectedGame}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onGameUpdated={fetchUserGames}
      />
    </div>
  );
};

export default MyGames;