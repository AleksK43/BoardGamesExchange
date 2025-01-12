import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { gameService } from '../../../services/api';
import { Book, X } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { BorrowGameRequestDTO } from '../../../types/requests';
import BorrowingProcess from '../../../components/BorrowingProcess';

const MyBorrowedGames: React.FC = () => {
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [borrowedGames, setBorrowedGames] = useState<BorrowGameRequestDTO[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [showBorrowingProcess, setShowBorrowingProcess] = useState(false);

  const fetchBorrowedGames = useCallback(async () => {
    if (!user) return;
    
    try {
      startLoading();
      const response = await gameService.getBorrowRequests(); // Zmiana na getBorrowRequests
      
      console.group('Borrowed Games Debug');
      console.log('Raw response:', response);
      console.log('User ID:', user.id);
      console.groupEnd();
  
      const activeBorrows = response.filter(req => {
        const isCurrentUserBorrower = req.boardGame.borrowedToUser?.id === user.id;
        const isAccepted = req.acceptDate !== null;
        const isNotReturned = req.returnDate === null;
  
        console.log('Request Details:', {
          gameTitle: req.boardGame.title,
          borrowedToUserId: req.boardGame.borrowedToUser?.id,
          currentUserId: user.id,
          isCurrentUserBorrower,
          isAccepted,
          isNotReturned
        });
  
        return isCurrentUserBorrower && isAccepted && isNotReturned;
      });
  
      console.log('Filtered Active Borrows:', activeBorrows);
      
      setBorrowedGames(activeBorrows);
    } catch (error) {
      console.error('Failed to fetch borrowed games:', error);
      showNotification('error', 'Failed to load borrowed games');
    } finally {
      stopLoading();
    }
  }, [user, startLoading, stopLoading, showNotification]);

  useEffect(() => {
    fetchBorrowedGames();
    // Odświeżamy co 5 sekund
    const intervalId = setInterval(fetchBorrowedGames, 500000);
    return () => clearInterval(intervalId);
  }, [fetchBorrowedGames]);

  const handleReturnGame = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowBorrowingProcess(true);
  };

  if (borrowedGames.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <p className="text-amber-200/70 font-crimson">No active borrowed games</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medieval text-amber-100">My Borrowed Games</h2>
      
      <div className="grid gap-4">
        {borrowedGames.map((game) => (
          <div 
            key={game.id}
            className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-4"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h3 className="font-medieval text-amber-100 text-lg">
                  {game.boardGame.title}
                </h3>
                
                <div className="flex items-center gap-6 text-sm text-amber-200/70">
                  <div className="flex items-center gap-2">
                    <Book size={16} />
                    <span>
                      From: {game.boardGame.owner.firstname} {game.boardGame.owner.lastname}
                    </span>
                  </div>
                  
                  <div className="text-amber-400">
                    Borrowed: {format(new Date(game.acceptDate!), 'PP', { locale: pl })}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleReturnGame(game.id)}
                className="px-4 py-2 bg-amber-700/80 rounded-lg hover:bg-amber-600/80 
                         transition-colors text-amber-100 font-medieval"
              >
                Return Game
              </button>
            </div>
          </div>
        ))}
      </div>

      {showBorrowingProcess && selectedRequestId && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowBorrowingProcess(false);
            setSelectedRequestId(null);
          }}
        >
          <div 
            className="w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowBorrowingProcess(false);
                setSelectedRequestId(null);
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-900/80 text-red-100 
                       rounded-full flex items-center justify-center hover:bg-red-800 
                       transition-colors z-10"
            >
              <X size={16} />
            </button>
            <BorrowingProcess
              borrowRequestId={selectedRequestId}
              mode="borrowed"
              onClose={() => {
                setShowBorrowingProcess(false);
                setSelectedRequestId(null);
                fetchBorrowedGames();
              }}
              onStatusChange={fetchBorrowedGames}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBorrowedGames;