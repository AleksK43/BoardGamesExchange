
export type GameCondition = 'new' | 'used' | 'damaged';

export type GameCategory = 'rpg' | 'strategy' | 'card' | 'board';

export type GamdeDifficulty = 'easy' | 'medium' | 'hard';


export interface GameFormData {
  title: string;
  description: string;
  condition: GameCondition;
  category: GameCategory;
  dificulty: GamdeDifficulty;
  price: number;
  images: File[];
  tags?: string[];
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  isExchangePossible?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  status: 'active' | 'deleted' | 'sold';
}

// Typy pomocnicze
export type GameFormErrors = Partial<Record<keyof GameFormData, string>>;

export interface GameFormState {
  data: GameFormData;
  errors: GameFormErrors;
  isSubmitting: boolean;
}