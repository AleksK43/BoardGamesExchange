import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, AlertTriangle, Phone, Mail, User } from 'lucide-react';
import { gameService } from '../services/api';
import { useAuth } from '../providers/AuthProvider';
import { useNotification } from '../providers/NotificationProvider';
import { useBorrowNotifications, getBorrowStatus } from '../services/borrowNotifications';
import RatingForm from './borrowing/RatingForm';
import { BorrowStatus } from './borrowing/BorrowingStatus';
import { BorrowGameRequestDTO, GameOwner } from '../types/requests';



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
  const { 
    checkForNewRequests, 
    checkForRequestUpdates, 
    checkForReturnRequests 
  } = useBorrowNotifications();

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

  const isBorrower = borrowRequest?.borrowedToUser.id === user?.id;
  const isOwner = borrowRequest?.boardGame.owner.id === user?.id;
  const status = getBorrowStatus(borrowRequest);

  const handleRequestBorrow = async () => {
    if (!gameId || !user) return;
    
    try {
      setLoading(true);
      await gameService.requestBorrow(gameId);
      showNotification('success', 'Borrow request sent successfully');
      await checkForNewRequests(borrowRequest?.boardGame.owner.id || 0);
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
      console.log('Accepting borrow request:', borrowRequestId);
      await gameService.acceptBorrowRequest(borrowRequestId);
      console.log('Borrow request accepted');
  
      // Pobierz zaktualizowane dane
      const [ownerRequests, userRequests] = await Promise.all([
        gameService.getBorrowRequests(),
        gameService.getMyBorrowRequests()
      ]);
      console.log('Updated requests:', { ownerRequests, userRequests });
  
      const updatedRequest = [...ownerRequests, ...userRequests]
        .find(req => req.id === borrowRequestId);
      console.log('Updated request:', updatedRequest);
  
      if (updatedRequest) {
        setBorrowRequest(updatedRequest);
      }
      
      showNotification('success', 'Borrow request accepted');
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Accept request error:', error);
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
      await checkForRequestUpdates(borrowRequest.borrowedToUser.id);
      onClose();
      onStatusChange?.();
    } catch {
      showNotification('error', 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!borrowRequestId || !borrowRequest) return;

    try {
      setLoading(true);

      if (isBorrower) {
        await Promise.all([
          gameService.returnGame(borrowRequestId, {
            comment,
            rating
          }),
          gameService.rateUser(borrowRequest.boardGame.owner.id, {
            comment,
            rating
          })
        ]);
        await checkForReturnRequests(borrowRequest.boardGame.owner.id);
        showNotification('success', 'Game return initiated and ratings submitted');
      } else if (isOwner) {
        // Owner rates borrower
        await gameService.rateUser(borrowRequest.borrowedToUser.id, {
          comment,
          rating
        });
        showNotification('success', 'Borrower rated successfully');
      }
      
      onStatusChange?.();
      onClose();
    } catch {
      showNotification('error', 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderContactInfo = () => {
    if (!borrowRequest?.boardGame.owner) return null;

    const owner = borrowRequest.boardGame.owner;
    return (
      <div className="mt-4 space-y-4 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          <h4 className="font-medieval text-lg text-amber-200">Contact Information</h4>
        </div>
        <div className="space-y-2">
          {owner.phone && (
            <div className="flex items-center gap-2 text-amber-100">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{owner.phone}</span>
            </div>
          )}
          {owner.email && (
            <div className="flex items-center gap-2 text-amber-100">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>{owner.email}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !borrowRequest) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                     rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {borrowRequest && (
        <BorrowStatus 
          request={borrowRequest} 
          onStatusChange={onStatusChange ? () => onStatusChange() : undefined} 
        />
      )}

      {mode === 'request' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-900/20 
                       to-amber-950/20 rounded-lg border border-amber-900/30">
            <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center 
                        justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-medieval text-lg text-amber-100">
                Request to Borrow
              </h3>
              <p className="text-amber-200/70 text-sm">
                Send a request to the game owner to borrow this game.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-amber-400 hover:text-amber-300 
                     transition-colors font-medieval"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestBorrow}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r
                     from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 
                     text-amber-100 rounded-lg transition-colors font-medieval 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-amber-100 
                               border-t-transparent rounded-full animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {mode === 'manage' && borrowRequest && status === 'pending' && (
        <div className="flex justify-end gap-4">
          <button
            onClick={handleRejectRequest}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/80 
                   hover:bg-red-800 text-red-100 rounded-lg 
                   transition-colors font-medieval"
          >
            <X className="w-5 h-5" />
            <span>Reject</span>
          </button>
          <button
            onClick={handleAcceptRequest}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-900/80 
                   hover:bg-green-800 text-green-100 rounded-lg 
                   transition-colors font-medieval"
          >
            <Check className="w-5 h-5" />
            <span>Accept</span>
          </button>
        </div>
      )}

      {status === 'accepted' && renderContactInfo()}

      {((mode === 'borrowed' && status === 'accepted') || 
        (mode === 'manage' && status === 'return_initiated')) && (
        <div className="space-y-4">
          <RatingForm
            type={mode === 'borrowed' ? 'game' : 'user'}
            rating={rating}
            comment={comment}
            onRatingChange={setRating}
            onCommentChange={setComment}
          />
          
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-amber-400 hover:text-amber-300 
                     transition-colors font-medieval"
            >
              Cancel
            </button>
            <button
              onClick={handleRatingSubmit}
              disabled={loading || !comment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r 
                     from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800
                     text-amber-100 rounded-lg transition-colors font-medieval 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-amber-100 
                               border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Submit Rating</span>
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