import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, Users, UserCog, Trash2, Activity } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { UserLevel } from '../../types/user';
import UsersManagement from './components/UsersManagement';
import ModeratorManagement from './components/ModeratorManagement';
import AdminManagement from './components/AdminManagement';
import DeletedUsers from './components/DeletedUsers';
import UserActivity from './components/UserActivity';
import { AdminUserType } from '../../types/admin';

type ActiveView = 'users' | 'moderators' | 'admins' | 'deleted' | 'activity';

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeView, setActiveView] = useState<ActiveView>('users');

  if (!isAuthenticated || user?.level !== UserLevel.ADMIN) {
    return <Navigate to="/app/games" replace />;
  }

  if (location.pathname === '/app/admin') {
    return <Navigate to="/app/admin/panel" replace />;
  }

  const menuItems = [
    {
      title: 'Zarządzanie Użytkownikami',
      icon: <Users size={20} />,
      view: 'users' as ActiveView,
      description: 'Zarządzaj standardowymi użytkownikami'
    },
    {
      title: 'Moderatorzy',
      icon: <UserCog size={20} />,
      view: 'moderators' as ActiveView,
      description: 'Zarządzaj kontami moderatorów'
    },
    {
      title: 'Administratorzy',
      icon: <Shield size={20} />,
      view: 'admins' as ActiveView,
      description: 'Zarządzaj uprawnieniami administratorów'
    },
    {
      title: 'Usunięci Użytkownicy',
      icon: <Trash2 size={20} />,
      view: 'deleted' as ActiveView,
      description: 'Przeglądaj usunięte konta'
    },
    {
      title: 'Aktywność Użytkowników',
      icon: <Activity size={20} />,
      view: 'activity' as ActiveView,
      description: 'Monitoruj aktywność użytkowników'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UsersManagement userType={AdminUserType.STANDARD} />;
      case 'moderators':
        return <ModeratorManagement />;
      case 'admins':
        return <AdminManagement />;
      case 'deleted':
        return <DeletedUsers />;
      case 'activity':
        return <UserActivity />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f0f] to-[#2c1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medieval text-amber-100 mb-2">
            Panel Administracyjny
          </h1>
          <p className="text-amber-200/70 font-crimson">
            Witaj w panelu administracyjnym. Zarządzaj użytkownikami i monitoruj aktywność systemu.
          </p>
        </div>

        {/* Menu Nawigacyjne */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center gap-2 px-4 py-6 rounded-lg 
                        transition-all duration-300 group ${
                          activeView === item.view
                            ? 'bg-amber-900/50 text-amber-100 border-2 border-amber-500/50'
                            : 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300'
                        }`}
            >
              <div className={`transform transition-transform duration-300 
                           ${activeView === item.view ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-medieval text-lg">{item.title}</span>
              <span className="text-xs text-center opacity-60 font-crimson">
                {item.description}
              </span>
            </button>
          ))}
        </div>

        {/* Obszar Zawartości */}
        <div className="bg-gradient-to-b from-[#2c1810]/50 to-[#1a0f0f]/50 
                     rounded-lg border border-amber-900/30 p-6 shadow-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;