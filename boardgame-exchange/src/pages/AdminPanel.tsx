import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { UserLevel } from '../types/user';

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.level !== UserLevel.ADMIN) {
    return <Navigate to="/app/games" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medieval text-amber-100 mb-6">Admin Panel</h1>
      <div className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] rounded-lg 
                    border border-amber-900/30 p-6">
        <p className="text-amber-100">Admin Panel content coming soon...</p>
      </div>
    </div>
  );
};

export default AdminPanel;