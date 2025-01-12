import axios from 'axios';
 
import { Game, CreateGameData, BoardGameImageDTO } from '../types/game';
import { UserDTO } from '../types/user';
import { BorrowGameRequestDTO } from '../types/requests';
import type { GameReview, ReviewRating } from '../types/review';
import { BorrowReturnDTO, ReviewRatingDTO } from '../types/rating';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    console.log('Request details:', {
      url: config.url,
      method: config.method,
      token: token ? 'present' : 'absent',
      headers: config.headers
    });

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error.response?.data, error.response?.status);
    return Promise.reject(error);
  }
);

interface GameService {
  confirmReturn: (borrowRequestId: number, data: BorrowReturnDTO) => Promise<void>;
  addUserReview: (data: ReviewRatingDTO) => Promise<void>;
  requestBorrow: (gameId: number) => Promise<void>;
  getBorrowRequests: () => Promise<BorrowGameRequestDTO[]>;
  getMyBorrowRequests: () => Promise<BorrowGameRequestDTO[]>;
  returnGame: (requestId: number, data: { rating: number; comment: string }) => Promise<void>;
  getGameReviews: (gameId: number) => Promise<GameReview[]>;
  getGameRating: (gameId: number) => Promise<ReviewRating>;
  requestBorrowGame: (gameId: number) => Promise<void>;
  deleteBorrowRequest: (borrowRequestId: number) => Promise<void>;
  getAllGames: () => Promise<Game[]>;
  editGame: (id: number, data: Partial<Game>) => Promise<Game>;
  addGame: (gameData: CreateGameData) => Promise<Game>;
  addGameImage: (boardGameId: number, imageData: Omit<BoardGameImageDTO, 'id'>) => Promise<BoardGameImageDTO>;
  removeGameImage: (imageId: number) => Promise<void>;
  deleteGame: (postId: number) => Promise<void>;
  getGameImages: (boardGameId: number) => Promise<BoardGameImageDTO[]>;
  rateUser: (data: RateUserData) => Promise<void>;
  getBorrowRequest: (requestId: number) => Promise<BorrowGameRequestDTO>;
  acceptBorrowRequest: (requestId: number) => Promise<void>;
  rejectBorrowRequest: (requestId: number) => Promise<void>;
}

interface RateUserData {
  reviewedUserId: number;
  rating: number;
  comment: string;
}

export const gameService: GameService = {
  requestBorrow: async (gameId: number): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${gameId}/request`);
    } catch (error) {
      console.error('Failed to request game borrow:', error);
      throw error;
    }
  },

  confirmReturn: async (borrowRequestId: number, data: BorrowReturnDTO): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${borrowRequestId}/confirm-return`, data);
    } catch (error) {
      console.error('Failed to confirm return:', error);
      throw error;
    }
  },

  getBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    try {
      const response = await api.get('/board-game/borrow-request/games');
      console.log('Raw Borrow Requests:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      throw error;
    }
  },

  getMyBorrowRequests: async (): Promise<BorrowGameRequestDTO[]> => {
    try {
      const response = await api.get('/board-game/borrow-request/games');
      console.log('Raw borrow requests:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching borrow requests:', error);
      throw error;
    }
  },


  acceptBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${borrowRequestId}/agree`);
      console.log('Accept response:', 'Request accepted');
    } catch (error) {
      console.error('Failed to accept borrow request:', error);
      throw error;
    }
  },

  returnGame: async (requestId: number, data: { rating: number; comment: string }) => {
    try {
      const response = await api.put(`/board-game/borrow-request/${requestId}/return`, data);
      return response.data;
    } catch (error) {
      console.error('Return game API error:', error);
      throw error;
    }
  },

  getGameReviews: async (gameId: number): Promise<GameReview[]> => {
    try {
      const response = await api.get<GameReview[]>(`/review/game/${gameId}/all`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch game reviews:', error);
      throw new Error('Failed to fetch game reviews');
    }
  },

  getGameRating: async (gameId: number): Promise<ReviewRating> => {
    try {
      const response = await api.get<ReviewRating>(`/review/game/${gameId}/avg`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch game rating:', error);
      throw new Error('Failed to fetch game rating');
    }
  },

  requestBorrowGame: async (gameId: number): Promise<void> => {
    await api.put(`/board-game/borrow-request/${gameId}/request`);
  },

  deleteBorrowRequest: async (borrowRequestId: number): Promise<void> => {
    try {
      await api.delete(`/board-game/borrow-request/${borrowRequestId}/delete`);
    } catch (error) {
      console.error('Failed to delete borrow request:', error);
      throw error;
    }
  },

  getAllGames: async (): Promise<Game[]> => {
    try {
      const response = await api.get('/board-game/all');
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  editGame: async (id: number, data: Partial<Game>) => {
    try {
      console.log('Sending edit request:', { id, data });
      const response = await api.put(`/board-game/${id}`, data);
      console.log('Edit response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Edit game error:', error);
      throw error;
    }
  },

  addGame: async (gameData: CreateGameData): Promise<Game> => {
    try {
      const formattedData = {
        title: gameData.title,
        description: gameData.description,
        category: gameData.category,
        condition: gameData.condition,
        numberOfPlayers: gameData.numberOfPlayers,
        availableFrom: gameData.availableFrom,
        availableTo: gameData.availableTo,
        difficulty: gameData.difficulty,
        deleted: false
      };
      
      console.log('Sending game data:', formattedData);
      const response = await api.post<Game>('/board-game/add', formattedData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to add game:', error);
        console.error('Response data:', error.response?.data);
      }
      throw new Error('Failed to add game');
    }
  },

  addGameImage: async (boardGameId: number, imageData: Omit<BoardGameImageDTO, 'id'>): Promise<BoardGameImageDTO> => {
    try {
      const response = await api.post<BoardGameImageDTO>(
        `/board-game-image/${boardGameId}/add`,
        {
          filename: imageData.filename,
          data: imageData.data,
          boardGameId: boardGameId,
          createDate: new Date().toISOString()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add game image:', error);
      throw new Error('Failed to add game image');
    }
  },

  removeGameImage: async (imageId: number): Promise<void> => {
    try {
      await api.delete(`/board-game-image/${imageId}/delete`);
    } catch (error) {
      console.error('Failed to remove game image:', error);
      throw new Error('Failed to remove game image');
    }
  },

  deleteGame: async (postId: number): Promise<void> => {
    try {
      await api.delete(`/board-game/delete/${postId}`);
    } catch (error) {
      console.error('Failed to delete game:', error);
      throw error;
    }
  },

  getGameImages: async (boardGameId: number): Promise<BoardGameImageDTO[]> => {
    try {
      const response = await api.get<BoardGameImageDTO[]>(
        `/board-game-image/${boardGameId}/fetch`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch game images:', error);
      throw new Error('Failed to fetch game images');
    }
  },



  getBorrowRequest: async (requestId: number): Promise<BorrowGameRequestDTO> => {
    try {
      const response = await api.get<BorrowGameRequestDTO>(`/board-game/borrow-request/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch borrow request:', error);
      throw new Error('Failed to fetch borrow request');
    }
  },


  rejectBorrowRequest: async (requestId: number): Promise<void> => {
    try {
      await api.put(`/board-game/borrow-request/${requestId}/reject`);
    } catch (error) {
      console.error('Failed to reject borrow request:', error);
      throw new Error('Failed to reject borrow request');
    }
  },

  addUserReview: async (data: ReviewRatingDTO): Promise<void> => {
    try {
      await api.post('/review/users/add', data);
    } catch (error) {
      console.error('Failed to add user review:', error);
      throw new Error('Failed to add user review');
    }
  },

  rateUser: async (data: RateUserData): Promise<void> => {
    try {
      await api.post('/review/users/add', data);
    } catch (error) {
      console.error('Failed to rate user:', error);
      throw error;
    }
  }
};

export const authService = {
  login: async (credentials: { login: string; password: string }): Promise<string> => {
    try {
      const response = await api.post('/user/auth', {
        email: credentials.login, // mapujemy login na email
        password: credentials.password
      });
      
      const token = response.data;
      if (token) {
        localStorage.setItem('jwt_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
      }
      throw new Error('No authentication token received');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Nieprawidłowe dane logowania!');
        }
      }
      throw new Error('Failed to login');
    }
  },

  register: async (data: { email: string; password: string }): Promise<UserDTO> => {
    try {
      const response = await api.post<UserDTO>('/user/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register');
    }
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    try {
      const response = await api.get<UserDTO>('/user/data');
      return response.data;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw new Error('Failed to get user data');
    }
  },

  updateUserData: async (userData: UserDTO): Promise<UserDTO> => {
    try {
      const response = await api.put<UserDTO>('/user/data', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put('/user/change-password', { oldPassword, newPassword });
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password');
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;