import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../components/GameCard';
import { Game, GameCardData } from '../types/game';
import { Filter, Lock, LogIn } from 'lucide-react';
import { useNotification } from '../providers/NotificationProvider';
import { useLoading } from '../providers/LoadingProvider';
import { useAuth } from '../providers/AuthProvider';
import { gameService } from '../services/api';
import { GameFilters as IGameFilters } from '../types/filters';
import GameFiltersComponent from '../components/GameFilters';
import SearchComponent from '../components/SearchComponent';
import GameDetailsModal from '../components/GameDetailsModal';
import AuthModal from '../components/AuthModal';

const GamesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'city'>('title');
  const [showFilters, setShowFilters] = useState(false);
  const [games, setGames] = useState<GameCardData[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameCardData | null>(null);
  const [isGameDetailsOpen, setIsGameDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<IGameFilters>({
    category: null,
    condition: null,
    difficulty: null,
    minPlayers: null,
    maxPlayers: null,
    city: null
  });

  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();

  // Funkcja mapująca pojedynczą grę
  const mapGameToCardData = async (game: Game): Promise<GameCardData> => {
    try {
      // Pobierz obrazy dla gry
      const gameImages = await gameService.getGameImages(game.id);
      // Mapuj wszystkie URLe obrazów
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
      console.error('Error mapping game:', error);
      // W przypadku błędu, zwróć grę z pustą tablicą obrazów
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

  const fetchGames = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      startLoading();
      const gamesData = await gameService.getAllGames();
      
      if (Array.isArray(gamesData)) {
        // Mapuj wszystkie gry równolegle
        const mappedGames = await Promise.all(
          gamesData.map(game => mapGameToCardData(game))
        );
        setGames(mappedGames);
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
      showNotification('error', 'Failed to load games');
      setGames([]);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, showNotification, isAuthenticated]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleSearch = (term: string, type: 'title' | 'city') => {
    setSearchTerm(term);
    setSearchType(type);
  };

  const handleGameClick = (game: GameCardData) => {
    setSelectedGame(game);
    setIsGameDetailsOpen(true);
  };

  // const handleContactOwner = () => {
  //   showNotification('info', 'Contact functionality coming soon!');
  // };

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Search filtering
      if (searchTerm) {
        if (searchType === 'city') {
          if (!game.owner.city?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
        } else {
          if (!game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
        }
      }

      // Category filter
      if (filters.category && game.category !== filters.category) {
        return false;
      }

      // Condition filter
      if (filters.condition && game.condition !== filters.condition) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && game.difficulty !== filters.difficulty) {
        return false;
      }

      // Number of players filter
      if (filters.minPlayers && game.numberOfPlayers < filters.minPlayers) {
        return false;
      }
      if (filters.maxPlayers && game.numberOfPlayers > filters.maxPlayers) {
        return false;
      }

      // City filter from advanced filters
      if (filters.city && game.owner.city) {
        const cityMatch = game.owner.city.toLowerCase().includes(filters.city.toLowerCase());
        if (!cityMatch) {
          return false;
        }
      }

      return true;
    });
  }, [games, searchTerm, searchType, filters]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center px-4">
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-amber-900/20 rounded-lg p-8 border border-amber-900/30">
            <div className="mb-6 flex justify-center">
              <Lock className="w-16 h-16 text-amber-500" />
            </div>
            <h2 className="text-3xl font-medieval text-amber-100 mb-4">
              Welcome, Adventurer!
            </h2>
            <p className="text-amber-200/80 mb-4 font-crimson text-lg">
              The grand hall of Board Buddies awaits behind these enchanted gates.
            </p>
            <p className="text-amber-200/80 mb-6 font-crimson text-lg">
              Join our fellowship of game masters and collectors to explore a treasure trove 
              of board games and forge alliances with fellow adventurers.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r 
                       from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 
                       text-amber-100 rounded-lg transition-colors transform hover:scale-105
                       font-medieval text-lg shadow-lg hover:shadow-amber-600/50"
            >
              <LogIn className="w-6 h-6" />
              <span>Begin Your Quest</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medieval text-amber-100 mb-6">
            The Grand Collection of Games
          </h1>
          
          {/* Search Bar */}
          <div className="space-y-4">
            <SearchComponent onSearch={handleSearch} />
            
            {/* Filters Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-2 font-medieval 
                         w-full sm:w-auto ${
                           showFilters 
                             ? 'bg-amber-800/50 text-amber-100 border-2 border-amber-500/50' 
                             : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                         }`}
              >
                <Filter className="h-5 w-5" />
                <span>Enchanted Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-900/30">
                    <GameFiltersComponent 
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onClick={handleGameClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              {games.length === 0 ? 'Loading games...' : 'No games match your filters'}
            </div>
          )}
        </div>
      </div>

      <GameDetailsModal
        game={selectedGame}
        isOpen={isGameDetailsOpen}
        onClose={() => setIsGameDetailsOpen(false)}
        // onContactOwner={handleContactOwner}
      />
    </div>
  );
};

export default GamesPage;