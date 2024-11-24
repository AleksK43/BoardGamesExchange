import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Upload, Edit2, History, Save, Lock } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan@example.com',
    phone: '+48 123 456 789'
  });

  const handleEdit = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleEdit = (field: string) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement avatar upload logic
      console.log('Upload file:', file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md mx-4 bg-gradient-to-b from-[#2c1810] to-[#1a0f0f]
                     rounded-xl shadow-xl border border-amber-900/30 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-amber-900/30">
              <div className="flex items-center gap-4">
                {/* Avatar Upload */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full bg-amber-900/30 border-2 border-amber-500/50
                              flex items-center justify-center overflow-hidden">
                    {profileData.avatarUrl ? (
                      <img 
                        src={profileData.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-amber-500" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center 
                                bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
                                transition-opacity cursor-pointer">
                    <Upload size={20} className="text-amber-100" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-medieval text-amber-100">My Prfoile</h2>
              </div>
              <button
                onClick={onClose}
                className="text-amber-400 hover:text-amber-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Dane osobowe */}
              <div className="space-y-4">
                {Object.entries(profileData).map(([field, value]) => (
                  field !== 'avatarUrl' && (
                    <div key={field} className="group relative">
                      <div className="flex items-center justify-between p-4 bg-amber-900/20 rounded-lg">
                        <div className="space-y-1 flex-1">
                          <label className="text-sm text-amber-400 capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}:
                          </label>
                          {editMode[field] ? (
                            <input
                              type={field === 'email' ? 'email' : 'text'}
                              value={value}
                              onChange={(e) => handleEdit(field, e.target.value)}
                              className="w-full bg-amber-950/50 text-amber-100 rounded px-2 py-1 
                                       border border-amber-500/30 focus:border-amber-500 
                                       focus:outline-none"
                            />
                          ) : (
                            <p className="text-amber-100">{value}</p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleEdit(field)}
                          className="ml-4 text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          {editMode[field] ? (
                            <Save size={18} />
                          ) : (
                            <Edit2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Przycisk zmiany hasła */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3 px-4 
                         bg-gradient-to-r from-amber-900/50 to-amber-800/50
                         hover:from-amber-800/50 hover:to-amber-700/50
                         text-amber-100 rounded-lg transition-colors border border-amber-900/30"
                onClick={() => {
                  // TODO: Implement password change logic
                  console.log('Change password clicked');
                }}
              >
                <Lock size={18} />
                <span>Change Password</span>
              </button>

              {/* Historia zmian */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3 px-4 
                         bg-gradient-to-r from-amber-900/50 to-amber-800/50
                         hover:from-amber-800/50 hover:to-amber-700/50
                         text-amber-100 rounded-lg transition-colors"
              >
                <History size={18} />
                <span>Account History</span>
              </button>

              {/* Przycisk zamknięcia */}
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700
                         hover:from-amber-700 hover:to-amber-800
                         text-amber-100 rounded-lg transition-colors
                         font-medieval text-lg shadow-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;