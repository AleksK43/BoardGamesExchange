import api from './api';
import type { AdminUser, AdminActivityFilter, UserActivityLog, UserActivityStats } from '../types/admin';

export const adminService = {
    getAllUsers: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/all');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania wszystkich użytkowników:', error);
            throw error;
        }
    },

    getDeletedUsers: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/all');
            // Dokładniejsze filtrowanie usuniętych użytkowników
            return response.data.filter((user: AdminUser) => 
                user.removeDate !== null && 
                user.removeDate !== undefined
            );
        } catch (error) {
            console.error('Błąd podczas pobierania usuniętych użytkowników:', error);
            throw error;
        }
    },

    getStandardUsers: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/standard');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania standardowych użytkowników:', error);
            throw error;
        }
    },

    getAdmins: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/admins');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania administratorów:', error);
            throw error;
        }
    },

    getModerators: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/moderators');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania moderatorów:', error);
            throw error;
        }
    },

    makeUserAdmin: async (userId: number): Promise<AdminUser> => {
        try {
            const response = await api.put(`/admin/users/${userId}/makeAdmin`);
            return response.data;
        } catch (error) {
            console.error('Błąd podczas nadawania uprawnień administratora:', error);
            throw error;
        }
    },

    makeUserModerator: async (userId: number): Promise<AdminUser> => {
        try {
            const response = await api.put(`/admin/users/${userId}/makeModerator`);
            return response.data;
        } catch (error) {
            console.error('Błąd podczas nadawania uprawnień moderatora:', error);
            throw error;
        }
    },

    makeUserStandard: async (userId: number): Promise<AdminUser> => {
        try {
            const response = await api.put(`/admin/users/${userId}/makeStandard`);
            return response.data;
        } catch (error) {
            console.error('Błąd podczas zmiany typu użytkownika:', error);
            throw error;
        }
    },

    getUserActivities: async (filters: AdminActivityFilter): Promise<UserActivityLog[]> => {
        try {
            const response = await api.get('/admin/activities', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania aktywności użytkowników:', error);
            throw error;
        }
    },

    getUserActivityStats: async (): Promise<UserActivityStats> => {
        try {
            const response = await api.get('/admin/activities/stats');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania statystyk aktywności:', error);
            throw error;
        }
    },

    

    blockUser: async (userId: number): Promise<AdminUser> => {
        try {
            console.log(`Próba zablokowania użytkownika o ID: ${userId}`);
            const response = await api.put(`/admin/users/${userId}/block`);
            
            console.log('Surowe dane odpowiedzi:', response.data);
    
            const updatedUser: AdminUser = {
                ...response.data,
                blocked: true  
            };
    
            console.log('Przetworzone dane użytkownika:', updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error('Błąd blokowania użytkownika:', error);
            throw error;
        }
    },

    activateUser: async (userId: number): Promise<AdminUser> => {
        try {
            console.log(`Próba aktywacji użytkownika o ID: ${userId}`);
            const response = await api.put(`/admin/users/${userId}/activate`);
            console.log('Odpowiedź po aktywacji:', response.data);
            return response.data;
        } catch (error) {
            console.error('Błąd aktywacji użytkownika:', error);
            throw error;
        }
    },

    getBlockedUsers: async (): Promise<AdminUser[]> => {
        try {
            const response = await api.get('/admin/users/all');
            return response.data.filter((user: AdminUser) => 
                user.blocked === true
            );
        } catch (error) {
            console.error('Błąd pobierania zablokowanych użytkowników:', error);
            throw error;
        }
    },

    removeUser: async (userId: number): Promise<AdminUser> => {
        try {
            console.log(`Próba usunięcia użytkownika o ID: ${userId}`);
            const response = await api.delete(`/admin/users/${userId}/remove`);
            console.log('Odpowiedź po usunięciu:', response.data);
            return response.data;
        } catch (error) {
            console.error('Błąd usuwania użytkownika:', error);
            throw error;
        }
    },

    hasAdminAccess: (user: AdminUser | null): boolean => {
        return user?.level === 2;
    },

    hasModeratorAccess: (user: AdminUser | null): boolean => {
        return user?.level === 1 || user?.level === 2;
    },

    getUserRoleName: (level: number): string => {
        switch (level) {
            case 2:
                return 'Administrator';
            case 1:
                return 'Moderator';
            default:
                return 'Użytkownik';
        }
    }
};

export default adminService;