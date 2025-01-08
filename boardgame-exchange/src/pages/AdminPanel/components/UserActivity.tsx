import React, { useState, useEffect } from 'react';
import { ActivitySquare } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNotification } from '../../../providers/NotificationProvider';
import { adminService } from '../../../services/adminApi';
import { UserActivityLog, UserActivityStats, AdminActivityFilter } from '../../../types/admin';

const UserActivity: React.FC = () => {
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [stats, setStats] = useState<UserActivityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [filters, setFilters] = useState<AdminActivityFilter>({
    dateFrom: subDays(new Date(), 7),
    dateTo: new Date()
  });

  const activityTypeLabels = {
    LOGIN: 'Logowanie',
    LOGOUT: 'Wylogowanie',
    GAME_ADDED: 'Dodanie gry',
    GAME_BORROWED: 'Wypożyczenie gry',
    GAME_RETURNED: 'Zwrot gry',
    PROFILE_UPDATED: 'Aktualizacja profilu'
  };

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      // Te endpointy należałoby dodać do backendu
      const activitiesData = await adminService.getUserActivities(filters);
      const statsData = await adminService.getUserActivityStats();
      setActivities(activitiesData);
      setStats(statsData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania danych o aktywności');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, [filters]);

 

  return (
    <div className="space-y-8">
      {/* Statystyki */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-4">
            <h3 className="text-amber-300 font-medieval mb-2">Ostatnie 24h</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-amber-100">
                <div className="text-2xl">{stats.activeUsers24h}</div>
                <div className="text-sm text-amber-300/70">Aktywni użytkownicy</div>
              </div>
              <div className="text-amber-100">
                <div className="text-2xl">{stats.newUsers24h}</div>
                <div className="text-sm text-amber-300/70">Nowi użytkownicy</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-4">
            <h3 className="text-amber-300 font-medieval mb-2">Ostatnie 7 dni</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-amber-100">
                <div className="text-2xl">{stats.activeUsers7d}</div>
                <div className="text-sm text-amber-300/70">Aktywni użytkownicy</div>
              </div>
              <div className="text-amber-100">
                <div className="text-2xl">{stats.newUsers7d}</div>
                <div className="text-sm text-amber-300/70">Nowi użytkownicy</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-4">
            <h3 className="text-amber-300 font-medieval mb-2">Łączna aktywność</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-amber-100">
                <div className="text-2xl">{stats.totalLogins}</div>
                <div className="text-sm text-amber-300/70">Logowania</div>
              </div>
              <div className="text-amber-100">
                <div className="text-2xl">{stats.activeUsers30d}</div>
                <div className="text-sm text-amber-300/70">Aktywni (30 dni)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtry */}
      <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                   rounded-lg border border-amber-900/30 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-sm text-amber-300 mb-1">Od daty</label>
            <input
              type="date"
              value={filters.dateFrom?.toISOString().split('T')[0]}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateFrom: new Date(e.target.value)
              }))}
              className="bg-amber-950/50 border border-amber-700/30 rounded px-3 py-2 
                      text-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm text-amber-300 mb-1">Do daty</label>
            <input
              type="date"
              value={filters.dateTo?.toISOString().split('T')[0]}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateTo: new Date(e.target.value)
              }))}
              className="bg-amber-950/50 border border-amber-700/30 rounded px-3 py-2 
                      text-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm text-amber-300 mb-1">Typ aktywności</label>
            <select
              value={filters.activityType || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                activityType: e.target.value || undefined
              }))}
              className="bg-amber-950/50 border border-amber-700/30 rounded px-3 py-2 
                      text-amber-100"
            >
              <option value="">Wszystkie</option>
              {Object.entries(activityTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista aktywności */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ActivitySquare 
                  className="text-amber-400" 
                  size={20} 
                />
                <div>
                  <div className="text-amber-100">
                    {activityTypeLabels[activity.activityType]}
                  </div>
                  <div className="text-sm text-amber-300/70">
                    {activity.userEmail}
                  </div>
                </div>
              </div>
              <div className="text-amber-200/70 text-sm">
                {format(new Date(activity.timestamp), 'dd MMM yyyy, HH:mm', { locale: pl })}
              </div>
            </div>
            {activity.details && (
              <div className="mt-2 text-sm text-amber-200/70 pl-9">
                {activity.details}
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                       rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UserActivity;