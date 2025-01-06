import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { gameService } from '../../../services/api';
import { Book, CalendarDays, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import { BorrowGameRequestDTO } from '../../../types/requests';

const MyBorrowedGames: React.FC = () => {
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const [borrowedGames, setBorrowedGames] = useState<BorrowGameRequestDTO[]>([]);
  const [returningGame, setReturningGame] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchBorrowedGames = async () => {
    try {
      startLoading();
      const response = await gameService.getMyBorrowRequests();
      setBorrowedGames(response);
    } catch (error) {
      console.error('Failed to fetch borrowed games:', error);
      showNotification('error', 'Failed to load borrowed games');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchBorrowedGames();
  }, []);

  const handleReturn = async (requestId: number) => {
    try {
      await gameService.returnGame(requestId, comment, rating);
      showNotification('success', 'Game returned successfully');
      setReturningGame(null);
      setComment('');
      setRating(5);
      fetchBorrowedGames();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to return game');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medieval text-amber-100">My Borrowed Games</h2>
      
      {borrowedGames.length === 0 ? (
        <div className="text-center py-8">
          <Book className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-amber-200/70 font-crimson">No borrowed games yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {borrowedGames.map((game) => (
            <div 
              key={game.id}
              className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-4"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <h3 className="font-medieval text-amber-100 text-lg">
                    {game.boardGame.title}
                  </h3>
                  
                  <div className="flex items-center gap-6 text-sm text-amber-200/70">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>
                        From: {game.boardGame.owner.firstname} {game.boardGame.owner.lastname}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <CalendarDays size={16} />
                      <span>
                        Borrowed: {format(new Date(game.acceptDate || game.createdDate), 'PP')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {game.acceptDate && !game.returnDate && (
                  returningGame === game.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`${
                              star <= rating ? 'text-amber-400' : 'text-amber-700'
                            } hover:text-amber-500 transition-colors`}
                          >
                            <Star size={20} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment..."
                        className="w-full bg-amber-900/20 rounded-lg p-2 text-amber-100
                                 border border-amber-500/30 focus:border-amber-500 
                                 focus:outline-none resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReturn(game.id)}
                          className="px-4 py-2 bg-amber-700 rounded-lg hover:bg-amber-600
                                   transition-colors text-amber-100 font-medieval"
                        >
                          Confirm Return
                        </button>
                        <button
                          onClick={() => setReturningGame(null)}
                          className="px-4 py-2 bg-amber-900/50 rounded-lg hover:bg-amber-900
                                   transition-colors text-amber-100 font-medieval"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReturningGame(game.id)}
                      className="px-4 py-2 bg-amber-900/80 rounded-lg hover:bg-amber-800 
                               transition-colors text-amber-100 font-medieval"
                    >
                      Return Game
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowedGames;