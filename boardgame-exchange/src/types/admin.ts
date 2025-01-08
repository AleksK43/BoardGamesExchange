// src/types/admin.ts
export interface AdminUser {
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
    blocked: boolean;
    removeDate: string | null;
  }
  
  export interface AdminUserResponse {
    users: AdminUser[];
    total: number;
  }

  
  export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    standardUsers: number;
    moderators: number;
    admins: number;
  }
  
  export interface AdminAction {
    type: 'MAKE_ADMIN' | 'MAKE_MODERATOR' | 'MAKE_STANDARD' | 'BLOCK' | 'ACTIVATE' | 'REMOVE';
    userId: number;
  }
  
  export interface AdminUserFilters {
    userType?: AdminUserType;
    searchTerm?: string;
    status?: 'active' | 'blocked' | 'removed';
    dateFrom?: string;
    dateTo?: string;
  }

  export interface AdminUser {
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
    blocked: boolean;
    removeDate: string | null;
}

export enum AdminUserType {
    STANDARD = 'standard',
    MODERATOR = 'moderator',
    ADMIN = 'admin'
}

export interface UserActivityLog {
    id: number;
    userId: number;
    userEmail: string;
    activityType: 'LOGIN' | 'LOGOUT' | 'GAME_ADDED' | 'GAME_BORROWED' | 'GAME_RETURNED' | 'PROFILE_UPDATED';
    timestamp: string;
    details?: string;
}

export interface UserActivityStats {
    totalLogins: number;
    activeUsers24h: number;
    activeUsers7d: number;
    activeUsers30d: number;
    newUsers24h: number;
    newUsers7d: number;
}

export interface AdminActivityFilter {
    dateFrom?: Date;
    dateTo?: Date;
    activityType?: string;
    userId?: number;
}

export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalGames: number;
    activeGames: number;
    totalBorrows: number;
    activeBorrows: number;
}

export interface AdminUser {
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
  blocked: boolean;
  removeDate: string | null;
}


export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  activeGames: number;
  totalBorrows: number;
  activeBorrows: number;
}

// Mapowanie poziomów użytkowników
export const USER_LEVELS = {
  STANDARD: 0,
  MODERATOR: 1,
  ADMIN: 2
} as const;