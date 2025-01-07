import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { 
  Clock, 
  Check, 
  X, 
  Star, 
  MessageCircle, 
  ArrowRight, 
  AlertTriangle,
  Phone,
  Mail,
  User,
  Dice1
} from 'lucide-react';
import { gameService } from '../services/api';
import { useAuth } from '../providers/AuthProvider';
import { useNotification } from '../providers/NotificationProvider';
import type { BorrowGameRequestDTO } from '../types/requests';
import {
  BorrowingProcessProps,
  ProcessStep,
  ReturnRating
} from '../types/borrowing';

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
  const [processStep, setProcessStep] = useState<ProcessStep>('request');
  const [returnRating, setReturnRating] = useState<ReturnRating>({
    gameRating: 5,
    ownerRating: 5,
    gameComment: '',
    ownerComment: ''
  });

  useEffect(() => {
    const fetchBorrowRequest = async () => {
      if (!borrowRequestId) return;
      
      try {
        setLoading(true);
        // Pobierz requesty zarówno właściciela jak i użytkownika
        const [ownerRequests, userRequests] = await Promise.all([
          gameService.getBorrowRequests(),
          gameService.getMyBorrowRequests()
        ]);
        
        const request = [...ownerRequests, ...userRequests]
          .find(req => req.id === borrowRequestId);
        
        if (request) {
          setBorrowRequest(request);
          if (request.acceptDate && !request.returnDate) {
            setProcessStep('accepted');
          } else if (request.returnDate) {
            setProcessStep('return');
          }
        }
      } catch (error) {
        console.error('Error fetching borrow request:', error);
        showNotification('error', 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowRequest();
  }, [borrowRequestId]);

  const isBorrower = borrowRequest?.borrowedToUser.id === user?.id;

  const handleRequestBorrow = async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      await gameService.requestBorrow(gameId);
      showNotification('success', 'Borrow request sent successfully');
      onStatusChange?.();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to send borrow request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!borrowRequestId) return;

    try {
      setLoading(true);
      await gameService.acceptBorrowRequest(borrowRequestId);
      showNotification('success', 'Borrow request accepted');
      setProcessStep('accepted');
      onStatusChange?.();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!borrowRequestId) return;

    try {
      setLoading(true);
      await gameService.deleteBorrowRequest(borrowRequestId);
      showNotification('success', 'Request rejected');
      onClose();
      onStatusChange?.();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnGame = async () => {
    if (!borrowRequestId || !isBorrower || !borrowRequest) return;

    try {
      setLoading(true);

      // Return game and rate it
      await gameService.returnGame(borrowRequestId, {
        comment: returnRating.gameComment,
        rating: returnRating.gameRating
      });

      // Rate the owner
      await gameService.rateUser(borrowRequest.boardGame.owner.id, {
        comment: returnRating.ownerComment,
        rating: returnRating.ownerRating
      });

      showNotification('success', 'Game returned and rated successfully');
      onStatusChange?.();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to return game');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (
    currentRating: number,
    onChange: (rating: number) => void
  ) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`${
            star <= currentRating ? 'text-amber-400' : 'text-amber-900'
          } hover:text-amber-500 transition-colors`}
        >
          <Star className="w-6 h-6" />
        </button>
      ))}
    </div>
  );

  const renderContactInfo = () => {
    if (!borrowRequest?.boardGame.owner) return null;

    const owner = borrowRequest.boardGame.owner;
    return (
      <div className="space-y-4 mt-4 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
        <h4 className="font-medieval text-amber-200">Owner Contact Information:</h4>
        {owner.phone && (
          <div className="flex items-center gap-2 text-amber-100">
            <Phone className="w-4 h-4" />
            <span>{owner.phone}</span>
          </div>
        )}
        {owner.email && (
          <div className="flex items-center gap-2 text-amber-100">
            <Mail className="w-4 h-4" />
            <span>{owner.email}</span>
          </div>
        )}
      </div>
    );
  };

  const renderReturnForm = () => (
    <div className="space-y-6">
      {/* Game Rating */}
      <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-900/30">
        <div className="flex items-center gap-2 mb-4">
          <Dice1 className="w-5 h-5 text-amber-400" />
          <h4 className="font-medieval text-lg text-amber-100">Rate the Game</h4>
        </div>
        {renderRatingStars(returnRating.gameRating, (rating) => 
          setReturnRating(prev => ({ ...prev, gameRating: rating }))
        )}
        <textarea
          value={returnRating.gameComment}
          onChange={(e) => setReturnRating(prev => ({ ...prev, gameComment: e.target.value }))}
          placeholder="How was the game? Share your experience..."
          className="mt-4 w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                    border border-amber-900/30 focus:border-amber-500 
                    focus:outline-none min-h-[80px]"
        />
      </div>

      {/* Owner Rating */}
      <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-900/30">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-amber-400" />
          <h4 className="font-medieval text-lg text-amber-100">Rate the Owner</h4>
        </div>
        {renderRatingStars(returnRating.ownerRating, (rating) => 
          setReturnRating(prev => ({ ...prev, ownerRating: rating }))
        )}
        <textarea
          value={returnRating.ownerComment}
          onChange={(e) => setReturnRating(prev => ({ ...prev, ownerComment: e.target.value }))}
          placeholder="How was your experience with the owner?"
          className="mt-4 w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                    border border-amber-900/30 focus:border-amber-500 
                    focus:outline-none min-h-[80px]"
        />
      </div>
    </div>
  );

  const renderProcessStep = () => {
    switch (processStep) {
      case 'request':
        if (mode === 'request') {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-amber-900/20 rounded-lg 
                           border border-amber-900/30">
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
                  className="flex items-center gap-2 px-4 py-2 bg-amber-700 
                           hover:bg-amber-600 text-amber-100 rounded-lg 
                           transition-colors font-medieval disabled:opacity-50 
                           disabled:cursor-not-allowed"
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
          );
        } else if (mode === 'manage' && borrowRequest) {
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-amber-900/20 rounded-lg 
                           border border-amber-900/30">
                <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center 
                            justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medieval text-lg text-amber-100">
                    Pending Request
                  </h3>
                  <p className="text-amber-200/70 text-sm">
                    From: {borrowRequest.borrowedToUser.firstname} {borrowRequest.borrowedToUser.lastname}
                  </p>
                </div>
              </div>

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
            </div>
          );
        }
        return null;

      case 'accepted':
        return borrowRequest ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-amber-900/20 rounded-lg 
                         border border-amber-900/30">
              <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center 
                          justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-medieval text-lg text-amber-100">
                  Request Accepted
                </h3>
                <p className="text-amber-200/70 text-sm">
                  {isBorrower ? 
                    'Your borrow request has been accepted. You can now contact the owner.' :
                    'You have accepted this borrow request.'}
                </p>
              </div>
            </div>

            {renderContactInfo()}

            {isBorrower && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setProcessStep('return')}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-700 
                           hover:bg-amber-600 text-amber-100 rounded-lg 
                           transition-colors font-medieval"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Return Game</span>
                </button>
              </div>
            )}
          </div>
        ) : null;

      case 'return':
        return borrowRequest && isBorrower ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-amber-900/20 rounded-lg 
                         border border-amber-900/30">
              <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center 
                          justify-center">
                <MessageCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medieval text-lg text-amber-100">
                  Return Game
                </h3>
                <p className="text-amber-200/70 text-sm">
                  Please rate both the game and the owner
                </p>
              </div>
            </div>

            {renderReturnForm()}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setProcessStep('accepted')}
                className="px-4 py-2 text-amber-400 hover:text-amber-300 
                         transition-colors font-medieval"
              >
                Back
              </button>
              <button
                onClick={handleReturnGame}
                disabled={loading || !returnRating.gameComment || !returnRating.ownerComment}
                className="flex items-center gap-2 px-4 py-2 bg-amber-700 
                         hover:bg-amber-600 text-amber-100 rounded-lg 
                         transition-colors font-medieval disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-100 
                                border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Submit & Return</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] rounded-lg 
                   border border-amber-900/30 p-6">
      {renderProcessStep()}
    </div>
  );
};

export default BorrowingProcess;