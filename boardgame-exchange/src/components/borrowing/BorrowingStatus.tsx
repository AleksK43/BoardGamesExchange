import React from 'react';
import { Clock, Check, CircleX, ArrowRightLeft, CalendarDays, Star } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { BorrowGameRequestDTO } from '../../types/requests';
import { useState } from 'react';
import { gameService } from '../../services/api';
import { useNotification } from '../../providers/NotificationProvider';
import { isAxiosError } from 'axios';


interface BorrowStatusProps {
  request: BorrowGameRequestDTO;
  onStatusChange?: () => void;
}

const BorrowStatus: React.FC<BorrowStatusProps> = ({ request, onStatusChange }) => {
  const { showNotification } = useNotification();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!showRatingForm) {
      setShowRatingForm(true);
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      showNotification('error', 'Proszę wybrać ocenę (1-5)');
      return;
    }

    try {
      setLoading(true);
      
      // Najpierw potwierdzenie zwrotu
      await gameService.confirmReturn(request.id, { rating, comment });
      
      // Potem ocena użytkownika
      await gameService.rateUser({
        reviewedUserId: request.borrowedToUser.id,
        rating,
        comment: comment.trim()
      });

      showNotification('success', 'Gra została zwrócona i użytkownik oceniony');
      onStatusChange?.();
    } catch (error) {
      console.error('Return game error:', error);
      if (isAxiosError(error)) {
        const errorMessage = error.response?.status === 400 
          ? 'Nieprawidłowe dane oceny'
          : 'Nie udało się potwierdzić zwrotu';
        showNotification('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!request) {
      return {
        icon: <CircleX className="w-6 h-6" />,
        title: 'Status Unavailable',
        description: 'Could not load request status',
        bgClass: 'bg-red-900/20',
        borderClass: 'border-red-900/30',
        textClass: 'text-red-200'
      };
    }

    if (request.returnDate) {
      return {
        icon: <Check className="w-6 h-6" />,
        title: 'Game Returned',
        description: `Returned on ${format(new Date(request.returnDate), 'PP', { locale: pl })}`,
        bgClass: 'bg-green-900/20',
        borderClass: 'border-green-900/30',
        textClass: 'text-green-200'
      };
    }

    if (request.acceptDate) {
      return {
        icon: <ArrowRightLeft className="w-6 h-6" />,
        title: 'Borrow Active',
        description: `Borrowed since ${format(new Date(request.acceptDate), 'PP', { locale: pl })}`,
        bgClass: 'bg-amber-900/20',
        borderClass: 'border-amber-900/30',
        textClass: 'text-amber-200'
      };
    }

    return {
      icon: <Clock className="w-6 h-6" />,
      title: 'Request Pending',
      description: `Requested on ${format(new Date(request.createdDate), 'PP', { locale: pl })}`,
      bgClass: 'bg-amber-900/20',
      borderClass: 'border-amber-900/30',
      textClass: 'text-amber-200'
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`p-4 ${status.bgClass} rounded-lg border ${status.borderClass}
                   transition-all duration-300 hover:border-opacity-50`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-black/20 flex items-center 
                      justify-center ${status.textClass}`}>
          {status.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medieval text-lg text-amber-100">
            {status.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-amber-200/70">
            <CalendarDays className="w-4 h-4" />
            <span>{status.description}</span>
          </div>
        </div>
      </div>

      {request.acceptDate && !request.returnDate && (
        <div className="mt-4 space-y-4">
          {showRatingForm && (
            <>
              <div className="flex gap-2 justify-center">
                {[1,2,3,4,5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    <Star fill={rating >= value ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add coment for the user..."
                className="w-full p-2 bg-amber-900/20 border border-amber-500/30 rounded-lg 
                         text-amber-100 placeholder-amber-400/50"
                rows={3}
              />
            </>
          )}

          <button
            onClick={handleReturn}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700
                     hover:from-green-700 hover:to-green-800 text-amber-100 rounded-lg 
                     transition-colors font-medieval"
            disabled={loading || (showRatingForm && !rating)}
          >
            {showRatingForm ? 'Accept Return and Rating' : 'Accept Return'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BorrowStatus;