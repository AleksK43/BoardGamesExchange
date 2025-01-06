export type GameCondition = 'new' | 'used' | 'damaged';
export type GameCategory = 'rpg' | 'strategy' | 'card' | 'board';
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Game {
  id: number;
  title: string;
  description: string;
  category: GameCategory;
  condition: GameCondition;
  owner: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    city: string;
    registrationDate: string;
    level: number;
    phone: string;
    avatarUrl: string | null;
    subscriptionUntil: string | null;
  };
  createDate: string;
  numberOfPlayers: number;
  availableFrom: string;
  availableTo: string;
  difficulty: GameDifficulty;
  rate?: number;
}

export interface GameFormData {
  title: string;
  description: string;
  category: GameCategory;
  condition: GameCondition;
  numberOfPlayers: number;
  availableFrom: Date;
  availableTo: Date;
  difficulty: GameDifficulty;
}

export interface CreateGameData {
  title: string;
  description: string;
  category: GameCategory;
  condition: GameCondition;
  numberOfPlayers: number;
  availableFrom: string; 
  availableTo: string;   
  difficulty: GameDifficulty;
}

export interface BoardGameImageDTO {
  id: number;
  createDate: Date;
  boardGameId: number;
  filename: string;
  data: string;
}

export interface GameCardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  condition: GameCondition;
  numberOfPlayers: number;
  availableFrom: string;
  availableTo: string;
  owner: {
    id: string;
    name: string;
    city: string;
  };
}