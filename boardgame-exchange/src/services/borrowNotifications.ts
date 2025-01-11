/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNotification } from '../providers/NotificationProvider';
import { gameService } from './api';
import { BorrowGameRequestDTO } from '../types/requests';

export const useBorrowNotifications = () => {
  const { showNotification } = useNotification();

  const checkForNewRequests = async (userId: number) => {
    try {
      const requests = await gameService.getBorrowRequests();
      const newRequests = requests.filter(req => !req.acceptDate && !req.returnDate);
      
      if (newRequests.length > 0) {
        showNotification(
          'info',
          `You have ${newRequests.length} new borrow request(s)`
        );
      }
    } catch (error) {
      console.error('Failed to check for new requests:', error);
    }
  };

  const checkForRequestUpdates = async (userId: number) => {
    try {
      const requests = await gameService.getMyBorrowRequests();
      
      requests.forEach(request => {
        if (request.acceptDate && !request.returnDate) {
          showNotification(
            'success',
            `Your request for ${request.boardGame.title} has been accepted!`
          );
        }
      });
    } catch (error) {
      console.error('Failed to check for request updates:', error);
    }
  };

  const checkForReturnRequests = async (userId: number) => {
    try {
      const requests = await gameService.getBorrowRequests();
      const returnRequests = requests.filter(req => 
        req.acceptDate && !req.returnDate && req.boardGame.owner.id === userId
      );
      
      returnRequests.forEach(request => {
        showNotification(
          'info',
          `${request.borrowedToUser.firstname} wants to return ${request.boardGame.title}`
        );
      });
    } catch (error) {
      console.error('Failed to check for return requests:', error);
    }
  };

  const checkForReturnConfirmations = async (userId: number) => {
    try {
      const requests = await gameService.getMyBorrowRequests();
      const confirmedReturns = requests.filter(req => 
        req.returnDate && req.boardGame.borrowedToUser === null
      );
      
      confirmedReturns.forEach(request => {
        showNotification(
          'success',
          `Return of ${request.boardGame.title} has been confirmed!`
        );
      });
    } catch (error) {
      console.error('Failed to check for return confirmations:', error);
    }
  };

  return {
    checkForNewRequests,
    checkForRequestUpdates,
    checkForReturnRequests,
    checkForReturnConfirmations
  };
};

export const getBorrowStatus = (request: BorrowGameRequestDTO | null) => {
  if (!request) return 'pending';
  
  if (request.returnDate) return 'completed';
  
  if (request.acceptDate) {
    if (request.comment) return 'return_initiated';
    return 'accepted';
  }
  
  return 'pending';
};