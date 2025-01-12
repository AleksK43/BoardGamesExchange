import React, { useState, useEffect } from 'react';
import { useNotification } from '../providers/NotificationProvider';
import { gameService } from '../services/api';
import { useAuth } from '../providers/AuthProvider';
import { BorrowGameRequestDTO } from '../types/requests';
import BorrowStatus from './borrowing/BorrowingStatus';
import RatingForm from './borrowing/RatingForm';
import { Book, Scroll, Shield, Swords } from 'lucide-react';

interface BorrowingProcessProps {
  gameId?: number;
  borrowRequestId?: number;
  mode: 'request' | 'manage' | 'borrowed';
  onClose: () => void;
  onStatusChange?: () => void;
}

const BorrowingProcess: React.FC<BorrowingProcessProps> = ({
  gameId,
  borrowRequestId,
  mode,
  onClose,
  onStatusChange
}) => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [borrowRequest, setBorrowRequest] = useState<BorrowGameRequestDTO | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBorrowRequest = async () => {
      if (!borrowRequestId) return;
      
      try {
        setLoading(true);
        const [ownerRequests, userRequests] = await Promise.all([
          gameService.getBorrowRequests(),
          gameService.getMyBorrowRequests()
        ]);
        
        const request = [...ownerRequests, ...userRequests]
          .find(req => req.id === borrowRequestId);
        
        if (request) {
          setBorrowRequest(request);
        }
      } catch {
        showNotification('error', 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowRequest();
    const intervalId = setInterval(fetchBorrowRequest, 5000);
    return () => clearInterval(intervalId);
  }, [borrowRequestId, showNotification]);

  const handleRequestBorrow = async () => {
    if (!gameId || !user) return;
    
    try {
      setLoading(true);
      await gameService.requestBorrow(gameId);
      showNotification('success', 'Borrow request sent successfully');
      onStatusChange?.();
      onClose();
    } catch {
      showNotification('error', 'Failed to send borrow request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!borrowRequestId || !borrowRequest) return;

    try {
      setLoading(true);
      await gameService.acceptBorrowRequest(borrowRequestId);
      showNotification('success', 'Borrow request accepted');
      onStatusChange?.();
      onClose();
    } catch (err) {
      console.error('Accept request error:', err);
      showNotification('error', 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!borrowRequestId || !borrowRequest) return;

    try {
      setLoading(true);
      await gameService.deleteBorrowRequest(borrowRequestId);
      showNotification('success', 'Request rejected');
      onStatusChange?.();
      onClose();
    } catch (err) {
      console.error('Reject request error:', err);
      showNotification('error', 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnGame = async () => {
    if (!borrowRequestId || !borrowRequest) return;

    try {
      setLoading(true);
      
      await Promise.all([
        gameService.returnGame(borrowRequestId, {
          comment,
          rating
        }),
        gameService.rateUser({
          reviewedUserId: borrowRequest.boardGame.owner.id,
          comment,
          rating
        })
      ]);
      
      showNotification('success', 'Game returned and rated successfully');
      onStatusChange?.();
      onClose();
    } catch (err) {
      console.error('Return game error:', err);
      showNotification('error', 'Failed to return game');
    } finally {
      setLoading(false);
    }
  };

  

  // Renderowanie procesu wysyłania requestu
  const renderRequestProcess = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-6 relative overflow-hidden">
        {/* Dekoracyjne elementy tła */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent 
                     via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent 
                     via-amber-500/20 to-transparent" />
        
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                       border-2 border-amber-500/30 flex items-center justify-center
                       shadow-lg shadow-amber-900/50">
            <Scroll className="w-8 h-8 text-amber-100" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medieval text-xl text-amber-100 mb-2">
              Request to Borrow
            </h3>
            <p className="text-amber-200/70 font-crimson">
              Send a formal request to the keeper of this game. Your quest for borrowing shall begin once approved.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 text-amber-400 hover:text-amber-300 transition-colors
                   font-medieval border border-amber-900/30 rounded-lg
                   hover:bg-amber-900/20"
        >
          Cancel Quest
        </button>
        <button
          onClick={handleRequestBorrow}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r
                   from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 
                   text-amber-100 rounded-lg transition-all duration-300 font-medieval
                   disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105
                   border border-amber-500/30 shadow-lg hover:shadow-amber-900/50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-amber-100 
                           border-t-transparent rounded-full animate-spin" />
              <span>Sending Request...</span>
            </>
          ) : (
            <>
              <Scroll size={20} />
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Renderowanie procesu zarządzania requestem
  const renderManageProcess = () => (
    <div className="space-y-6">
      {borrowRequest && !borrowRequest.acceptDate && (
        <div className="flex justify-end gap-4">
          <button
            onClick={handleRejectRequest}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r
                     from-red-900 to-red-800 hover:from-red-800 hover:to-red-700
                     text-red-100 rounded-lg transition-all duration-300 font-medieval
                     border border-red-500/30 shadow-lg hover:shadow-red-900/50
                     transform hover:scale-105"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-red-100 
                           border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Swords size={20} />
                <span>Reject Request</span>
              </>
            )}
          </button>
          <button
            onClick={handleAcceptRequest}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r
                     from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900
                     text-amber-100 rounded-lg transition-all duration-300 font-medieval
                     border border-amber-500/30 shadow-lg hover:shadow-amber-900/50
                     transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-amber-100 
                             border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Shield size={20} />
                <span>Accept Request</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Sprawdzanie stanu ładowania
  if (loading && !borrowRequest) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                     rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] 
                   rounded-xl border border-amber-900/30 space-y-6
                   shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {/* Status wypożyczenia */}
      {borrowRequest && (
        <div className="mb-8">
          <BorrowStatus 
            request={borrowRequest} 
            onStatusChange={onStatusChange}
          />
        </div>
      )}

      {/* Renderowanie odpowiedniego widoku w zależności od trybu */}
      {mode === 'request' && renderRequestProcess()}
      {mode === 'manage' && renderManageProcess()}
      
      {/* Proces zwrotu i oceny */}
      {mode === 'borrowed' && borrowRequest?.acceptDate && !borrowRequest?.returnDate && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-6">
            <RatingForm
              type="game"
              rating={rating}
              comment={comment}
              onRatingChange={setRating}
              onCommentChange={setComment}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-amber-400 hover:text-amber-300 transition-colors
                     font-medieval border border-amber-900/30 rounded-lg
                     hover:bg-amber-900/20"
            >
              Cancel
            </button>
            <button
              onClick={handleReturnGame}
              disabled={loading || !comment.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r
                     from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900
                     text-amber-100 rounded-lg transition-all duration-300 font-medieval
                     disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105
                     border border-amber-500/30 shadow-lg hover:shadow-amber-900/50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-amber-100 
                               border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Book size={20} />
                  <span>Complete Return</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingProcess;