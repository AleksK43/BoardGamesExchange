export interface Game {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    players: {
      min: number;
      max: number;
    };
    playTime: {
      min: number;
      max: number;
    };
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    rating: number;
    owner: {
      id: string;
      name: string;
      location: string;
    };
  }