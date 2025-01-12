export interface ReviewRatingDTO {
  rating: number;
  comment: string;
  userId?: number;
}

export interface ReviewDTO {
  id: number;
  gameId?: number;
  userId?: number;
  rating: number;
  comment: string;
  createdDate: string;
  reviewerId: number;
  reviewerName: string;
}

export interface BorrowReturnDTO {
  rating: number;
  comment: string;
}

// Odpowiedzi z API
export interface UserReviewResponse {
  avgRating: number;
  reviews: ReviewDTO[];
}

export interface GameReviewResponse {
  avgRating: number;
  reviews: ReviewDTO[];
}