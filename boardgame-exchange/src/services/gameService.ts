import api from './api';
import type { BorrowGameRequestDTO, BorrowReturnDTO } from '../types/requests';

export const gameService = {
  // Borrow requests
  requestBorrow: async (gameId: number): Promise<void> => {
    await api.put(`/board-game/borrow-request/${gameId}/request`);
  },

  getBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    try {
      const response = await api.get('/board-game/borrow-request/games');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch borrow requests:', error);
      throw error;
    }
  },

  getMyBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    try {
      const response = await api.get('/board-game/borrow-request/my');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my borrow requests:', error);
      throw error;
    }
  },

  acceptBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${borrowRequestId}/agree`);
    } catch (error) {
      console.error('Failed to accept borrow request:', error);
      throw error;
    }
  },

  returnGame: async (borrowRequestId: number, data: { comment: string; rating: number }): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${borrowRequestId}/return`, {
        comment: data.comment,
        rating: data.rating
      });
    } catch (error) {
      console.error('Failed to return game:', error);
      throw error;
    }
  },

  deleteBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    try {
      await api.delete(`/board-game/borrow-request/${borrowRequestId}/delete`);
    } catch (error) {
      console.error('Failed to delete borrow request:', error);
      throw error;
    }
  },

  // Ratings
  rateUser: async (userId: number, data: { comment: string; rating: number }): Promise<void> => {
    try {
      await api.post('/review/users/add', {
        reviewedUserId: userId,
        rating: data.rating,
        comment: data.comment
      });
    } catch (error) {
      console.error('Failed to rate user:', error);
      throw error;
    }
  },
  getAllBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    try {
      const [ownerRequests, myRequests] = await Promise.all([
        api.get('/board-game/borrow-request/games').then(res => res.data),
        api.get('/board-game/borrow-request/my').then(res => res.data)
      ]);
      
      const allRequests = [...ownerRequests, ...myRequests];
      const uniqueRequests = Array.from(
        new Map(allRequests.map(req => [req.id, req])).values()
      );
      
      return uniqueRequests;
    } catch (error) {
      console.error('Failed to fetch all borrow requests:', error);
      throw error;
    }
  },
  
  confirmReturn: async (borrowRequestId: number, data: BorrowReturnDTO): Promise<void> => {
    await api.put(`/board-game/borrow-request/${borrowRequestId}/confirm-return`, data);
  }
};

export default gameService;