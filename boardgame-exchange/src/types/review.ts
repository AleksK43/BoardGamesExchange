export interface GameReview {
    id?: number;
    reviewerId: {
      id: number;
      email: string;
      firstname: string | null;
      lastname: string | null;
      city: string | null;
    };
    rating: number;
    comment: string;
    createDate: string;
  }
  
  export interface ReviewRating {
    average: number;
    starsCount_1: number;
    starsCount_2: number;
    starsCount_3: number;
    starsCount_4: number;
    starsCount_5: number;
  }