/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Crown, UserMinus, UserPlus } from 'lucide-react';
import { adminService } from '../../../services/adminApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { AdminUser } from '../../../types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [standardUsers, setStandardUsers] = useState<AdminUser[]>([]);
  const { showNotification } = useNotification();

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdmins();
      setAdmins(response);
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania listy administratorów');
    } finally {
      setLoading(false);
    }
  };

  const fetchStandardUsers = async () => {
    try {
      const response = await adminService.getStandardUsers();
      setStandardUsers(response);
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania listy użytkowników');
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchStandardUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDemote = async (userId: number) => {
    if (window.confirm('Czy na pewno chcesz zdegradować tego administratora?')) {
      try {
        await adminService.makeUserStandard(userId);
        showNotification('success', 'Administrator został zdegradowany do standardowego użytkownika');
        fetchAdmins();
      } catch (error) {
        showNotification('error', 'Błąd podczas degradowania administratora');
      }
    }
  };

  const handlePromote = async () => {
    if (!selectedUserId) return;
    
    try {
      await adminService.makeUserAdmin(selectedUserId);
      showNotification('success', 'Użytkownik został awansowany na administratora');
      setShowPromoteModal(false);
      setSelectedUserId(null);
      fetchAdmins();
      fetchStandardUsers();
    } catch (error) {
      showNotification('error', 'Błąd podczas awansowania użytkownika');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medieval text-amber-100">
          Zarządzanie Administratorami
        </h2>
        <button
          onClick={() => setShowPromoteModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 
                   hover:from-amber-700 hover:to-amber-800 text-amber-100 
                   rounded-lg transition-colors font-medieval flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Dodaj Administratora</span>
        </button>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 
                            to-amber-800 flex items-center justify-center text-amber-100
                            font-medieval text-xl border-2 border-amber-500/30">
                  {admin.firstname?.[0] || admin.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-medieval text-amber-100">
                    {admin.firstname} {admin.lastname}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-amber-200/70">
                    <span>{admin.email}</span>
                    <span>•</span>
                    <span>Administrator od: {format(new Date(admin.registrationDate), 'd MMMM yyyy', { locale: pl })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-900/30 
                              rounded-full text-amber-100 text-sm">
                  <Crown size={14} />
                  <span>Administrator</span>
                </div>

                <button
                  onClick={() => handleDemote(admin.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-900/30 
                           rounded-full text-red-200 text-sm hover:bg-red-900/50
                           transition-colors"
                >
                  <UserMinus size={14} />
                  <span>Degraduj</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {admin.city && (
                <div className="text-amber-200/70">
                  <span className="text-amber-300">Lokalizacja:</span> {admin.city}
                </div>
              )}
              {admin.phone && (
                <div className="text-amber-200/70">
                  <span className="text-amber-300">Telefon:</span> {admin.phone}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 
                     flex items-center justify-center">
          <div className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] 
                       rounded-lg border border-amber-900/30 p-6 w-full max-w-lg">
            <h3 className="text-xl font-medieval text-amber-100 mb-4">
              Dodaj Nowego Administratora
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-amber-300 mb-2">
                  Wybierz użytkownika
                </label>
                <select
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="w-full bg-amber-950/50 border border-amber-700/30 
                         rounded px-3 py-2 text-amber-100"
                >
                  <option value="">Wybierz użytkownika...</option>
                  {standardUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.firstname} {user.lastname})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 text-amber-400 hover:text-amber-300 
                           transition-colors font-medieval"
                >
                  Anuluj
                </button>
                <button
                  onClick={handlePromote}
                  disabled={!selectedUserId}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 
                         hover:from-amber-700 hover:to-amber-800 text-amber-100 
                         rounded-lg transition-colors font-medieval 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
                >
                  <Crown size={18} />
                  <span>Awansuj na Administratora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                       rounded-full animate-spin" />
        </div>
      )}

      {!loading && admins.length === 0 && (
        <div className="text-center py-8 text-amber-400">
          Brak administratorów do wyświetlenia
        </div>
      )}
    </div>
  );
};

export default AdminManagement;