import axios, { AxiosError } from 'axios';
import { UserDTO, UserUpdateDTO } from '../types/user';
import { Game } from '../types/game';

const api = axios.create({
  baseURL: '/api/v1'
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => Promise.reject(error)
);

export const gameService = {
  addGame: async (gameData: Game): Promise<Game> => {
    try {
      const response = await api.put<Game>('/board-game/add', {
        title: gameData.title,
        description: gameData.description,
        category: gameData.category,
        condition: gameData.condition,
        numberOfPlayers: gameData.numberOfPlayers,
        availableFrom: gameData.availableFrom,
        availableTo: gameData.availableTo,
        difficulty: gameData.difficulty,
        imageBase64: gameData.imageBase64,
        user: gameData.owner 
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Full error details:', axiosError);
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);
      throw new Error('Failed to add game');
    }
  },

  getAllGames: async (): Promise<Game[]> => {
    try {
      const response = await api.get<Game[]>('/board-game/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw new Error('Failed to fetch games');
    }
  },

  editGame: async (gameId: string, gameData: Omit<Game, 'id' | 'createDate' | 'owner'>) => {
    try {
      const response = await api.post<Game>(`/board-game/edit/${gameId}`, {
        title: gameData.title,
        description: gameData.description,
        category: gameData.category,
        condition: gameData.condition,
        numberOfPlayers: gameData.numberOfPlayers,
        availableFrom: gameData.availableFrom,
        availableTo: gameData.availableTo,
        difficulty: gameData.difficulty,
        imageBase64: gameData.imageBase64
      });
      return response.data;
    } catch (error) {
      console.error('Error editing game:', error);
      throw new Error('Failed to edit game');
    }
  },

  deleteGame: async (gameId: string) => {
    try {
      await api.delete(`/board-game/delete/${gameId}`);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw new Error('Failed to delete game');
    }
  }
};

export const authService = {
  login: async (credentials: { login: string; password: string }): Promise<string> => {
    try {
      const response = await api.post('/user/auth', {
        email: credentials.login,
        password: credentials.password
      });
      
      const token = response.data;
      if (token) {
        localStorage.setItem('jwt_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
      }
      throw new Error('Nie otrzymano tokenu autoryzacji');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Błąd logowania');
    }
  },

  register: async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/user/register', data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Błąd rejestracji');
    }
  },

  updateUserData: async (userData: UserUpdateDTO): Promise<UserDTO> => {
    try {
      const response = await api.put<UserDTO>('/user/data', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('Failed to update user data');
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

  logout: () => {
    localStorage.removeItem('jwt_token');
    delete api.defaults.headers.common['Authorization'];
  }

};

export default api;