// src/types/borrowing.ts

export type BorrowingProcessMode = 'request' | 'manage' | 'borrowed';
export type ProcessStep = 'request' | 'accepted' | 'return';

export interface BorrowingProcessProps {
  gameId?: number;
  borrowRequestId?: number;
  mode: BorrowingProcessMode;
  onClose: () => void;
  onStatusChange?: () => void;
}

export interface ReturnRating {
  gameRating: number;
  ownerRating: number;
  gameComment: string;
  ownerComment: string;
}

export interface ReturnGameData {
  comment: string;
  rating: number;
}

export interface RateUserData {
  reviewedUserId: number;
  rating: number;
  comment: string;
}

// API Response Types
export interface BorrowRequestResponse {
  success: boolean;
  message?: string;
  requestId?: number;
}

export interface ReturnGameResponse {
  success: boolean;
  message?: string;
}

export interface RatingResponse {
  success: boolean;
  message?: string;
  rating?: {
    id: number;
    value: number;
    date: string;
  };
}

// Error Types
export interface BorrowingError {
  code: string;
  message: string;
  details?: string;
}