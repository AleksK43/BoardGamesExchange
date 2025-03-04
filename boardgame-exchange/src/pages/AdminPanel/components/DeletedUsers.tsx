import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { format, isValid } from 'date-fns'; // Dodaj import isValid
import { adminService } from '../../../services/adminApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { AdminUser } from '../../../types/admin';

const DeletedUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchDeletedUsers = async () => {
    try {
      setLoading(true);
      const deletedUsers = await adminService.getDeletedUsers();
      setUsers(deletedUsers);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania usuniętych użytkowników');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const handleRestore = async (userId: number) => {
    try {
      const response = await adminService.activateUser(userId);
      console.log('Odpowiedź serwera:', response);
      showNotification('success', 'Użytkownik został przywrócony');
      fetchDeletedUsers();
    } catch (error) {
      console.error('Pełny błąd:', error);
      showNotification('error', 'Błąd podczas przywracania użytkownika');
    }
  };

  // Bezpieczna funkcja formatowania daty
  const formatSafeDate = (date: string | Date | null, defaultText: string = 'Nieznana data') => {
    if (!date) return defaultText;
    
    const parsedDate = new Date(date);
    return isValid(parsedDate) 
      ? format(parsedDate, 'dd.MM.yyyy') 
      : defaultText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medieval text-amber-100">
          Usunięci Użytkownicy
        </h2>
        <div className="flex items-center gap-2 text-amber-200/70 text-sm">
          <Trash2 size={16} />
          <span>Łącznie usuniętych: {users.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gradient-to-r from-red-900/20 to-red-950/20 
                     rounded-lg border border-red-900/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medieval text-red-100 text-lg">
                  {user.firstname} {user.lastname}
                </h3>
                <div className="flex items-center gap-4 text-sm text-red-200/70">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>
                    Usunięty: {formatSafeDate(user.removeDate || '', 'Nieznana data usunięcia')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRestore(user.id)}
                className="flex items-center gap-2 px-3 py-2 bg-amber-900/30 
                         rounded-lg text-amber-100 hover:bg-amber-900/50
                         transition-colors font-medieval"
              >
                <RefreshCw size={16} />
                <span>Przywróć</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-red-200/70">
              <div>
                <strong className="text-red-200">Data rejestracji:</strong>{' '}
                {formatSafeDate(user.registrationDate, 'Nieznana data rejestracji')}
              </div>
              {user.city && (
                <div>
                  <strong className="text-red-200">Lokalizacja:</strong> {user.city}
                </div>
              )}
              {user.phone && (
                <div>
                  <strong className="text-red-200">Telefon:</strong> {user.phone}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent 
                       rounded-full animate-spin" />
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-8 text-amber-400">
          Brak usuniętych użytkowników
        </div>
      )}
    </div>
  );
};

export default DeletedUsers;