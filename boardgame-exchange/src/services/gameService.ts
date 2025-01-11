import api from './api';
import type { BorrowGameRequestDTO, BorrowReturnDTO } from '../types/requests';

export const gameService = {
  // Borrow requests
  requestBorrow: async (gameId: number): Promise<void> => {
    await api.put(`/board-game/borrow-request/${gameId}/request`);
  },

  getBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    const response = await api.get('/board-game/borrow-request/games');
    return response.data;
  },

  getMyBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    const response = await api.get('/board-game/borrow-request/my');
    return response.data;
  },

  acceptBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    await api.put(`/board-game/borrow-request/${borrowRequestId}/agree`);
  },

  returnGame: async (borrowRequestId: number, data: BorrowReturnDTO): Promise<void> => {
    await api.put(`/board-game/borrow-request/${borrowRequestId}/return`, data);
  },

  deleteBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    await api.delete(`/board-game/borrow-request/${borrowRequestId}/delete`);
  },

  // Ratings
  rateUser: async (userId: number, data: { comment: string; rating: number }): Promise<void> => {
    await api.post('/review/users/add', {
      reviewedUserId: userId,
      rating: data.rating,
      comment: data.comment
    });
  },
  
  confirmReturn: async (borrowRequestId: number, data: BorrowReturnDTO): Promise<void> => {
    await api.put(`/board-game/borrow-request/${borrowRequestId}/confirm-return`, data);
  }
};

export default gameService;