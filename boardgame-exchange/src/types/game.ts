
export type GameCondition = 'new' | 'used' | 'damaged';
export type GameCategory = 'rpg' | 'strategy' | 'card' | 'board';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  id: string;
  title: string;
  description: string;
  imageBase64: string;
  category: GameCategory;
  numberOfPlayers: number;
  condition: GameCondition;
  availableFrom: Date;
  availableTo: Date;
  difficulty: GameDifficulty;
  createDate: Date;
  owner: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      city: string;
  };
}