/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Shield, ArrowDown, Calendar } from 'lucide-react';
import { adminService } from '../../../services/adminApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { AdminUser } from '../../../types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const ModeratorManagement: React.FC = () => {
  const [moderators, setModerators] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    try {
      setLoading(true);
      const response = await adminService.getModerators();
      setModerators(response);
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania listy moderatorów');
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async (userId: number) => {
    try {
      await adminService.makeUserStandard(userId);
      showNotification('success', 'Moderator został zdegradowany do standardowego użytkownika');
      fetchModerators();
    } catch (error) {
      showNotification('error', 'Błąd podczas degradowania moderatora');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medieval text-amber-100">
          Zarządzanie Moderatorami
        </h2>
        <div className="flex items-center gap-2 text-amber-200/70 text-sm">
          <Calendar size={16} />
          <span>Łącznie moderatorów: {moderators.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {moderators.map((moderator) => (
          <div
            key={moderator.id}
            className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-4 hover:border-amber-700/50
                     transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medieval text-amber-100 text-lg">
                  {moderator.firstname} {moderator.lastname}
                </h3>
                <div className="flex items-center gap-4 text-sm text-amber-200/70">
                  <span>{moderator.email}</span>
                  <span>•</span>
                  <span>Dołączył: {format(new Date(moderator.registrationDate), 'd MMMM yyyy', { locale: pl })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-900/30 
                              rounded-full text-amber-100 text-sm">
                  <Shield size={14} />
                  <span>Moderator</span>
                </div>
                
                <button
                  onClick={() => handleDemote(moderator.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-900/30 
                           rounded-full text-red-200 text-sm hover:bg-red-900/50
                           transition-colors"
                >
                  <ArrowDown size={14} />
                  <span>Degraduj</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {moderator.city && (
                <div className="text-sm text-amber-200/70">
                  Lokalizacja: {moderator.city}
                </div>
              )}
              {moderator.phone && (
                <div className="text-sm text-amber-200/70">
                  Telefon: {moderator.phone}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                         rounded-full animate-spin" />
          </div>
        )}

        {!loading && moderators.length === 0 && (
          <div className="text-center py-8 text-amber-400">
            Brak moderatorów do wyświetlenia
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorManagement;