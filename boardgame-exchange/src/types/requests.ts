export interface GameOwner {
    id: number;
    email: string;
    firstname: string | null;
    lastname: string | null;
    city: string | null;
    registrationDate: string;
    level: number;
    phone: string | null;
    avatarUrl: string | null;
    subscriptionUntil: string | null;
}

export interface BoardGameRequest {
    id: number;
    title: string;
    description: string;
    category: string;
    condition: string;
    difficulty: string;
    numberOfPlayers: number;
    owner: GameOwner;
    createDate: string;
    availableFrom: string;
    availableTo: string;
    deleted: boolean;
    borrowedToUser: GameOwner | null;
}

export interface BorrowGameRequestDTO {
    id: number;
    boardGame: BoardGameRequest;
    borrowedToUser: GameOwner;
    createdDate: string;
    acceptDate: string | null;
    returnDate: string | null;
    status: string;
    comment?: string | null;
    rating?: number | null;
}

export interface BorrowReturnDTO {
    rating: number;
    comment: string;
}

export interface ReviewRequest {
    userId: number;
    rating: number;
    comment: string;
}