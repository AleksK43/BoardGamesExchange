import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Upload, Edit2, Save, Lock, Crown, CircleDot, Scroll, MapPin, Phone, Mail, CalendarDays } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useNotification } from '../providers/NotificationProvider';
import { authService } from '../services/api';
import { UserDTO, UserUpdateDTO } from '../types/user';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [profileData, setProfileData] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setProfileData(userData);
      } catch {
        showNotification('error', 'Failed to load user data');
      }
    };

    if (isOpen && user) {
      fetchUserData();
    }
  }, [isOpen, user, showNotification]);

  const handleEdit = async (field: keyof UserDTO, value: string | number) => {
    if (!profileData || !user) return;

    setLoading(prev => ({ ...prev, [field]: true }));

    try {
      const updateData: UserUpdateDTO = {
        ...profileData,
        [field]: value
      };

      const updatedUser = await authService.updateUserData(updateData);
      setProfileData(updatedUser);
      showNotification('success', 'Profile updated successfully');
      setEditMode(prev => ({ ...prev, [field]: false }));
    } catch {
      showNotification('error', 'Failed to update profile');
      setProfileData(prev => prev ? {
        ...prev,
        [field]: user[field as keyof typeof user] || null
      } : null);
    } finally {
      setLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const toggleEdit = (field: string) => {
    if (loading[field]) return;
    
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showNotification('info', 'Avatar upload functionality coming soon');
    }
  };

  const renderEditableField = (
    field: keyof UserDTO,
    label: string,
    value: string | null,
    icon: React.ReactNode
  ) => (
    <div className="group relative">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                    rounded-lg border border-amber-900/30 hover:border-amber-800/50 transition-colors">
        <div className="space-y-1 flex-1">
          <label className="text-sm text-amber-400 font-medieval flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </label>
          {editMode[field] ? (
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              value={value || ''}
              onChange={(e) => setProfileData(prev => prev ? {
                ...prev,
                [field]: e.target.value
              } : null)}
              className="w-full bg-amber-950/50 text-amber-100 rounded px-3 py-2 mt-1
                      border border-amber-500/30 focus:border-amber-500 focus:outline-none
                      font-crimson"
            />
          ) : (
            <p className="text-amber-100 font-crimson">{value || 'Not set'}</p>
          )}
        </div>
        <button
          onClick={() => {
            if (editMode[field]) {
              handleEdit(field, profileData?.[field] ?? '');
            } else {
              toggleEdit(field);
            }
          }}
          disabled={loading[field]}
          className="ml-4 text-amber-400 hover:text-amber-300 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-amber-900/30
                   rounded-full"
        >
          {loading[field] ? (
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent 
                         rounded-full animate-spin" />
          ) : editMode[field] ? (
            <Save size={20} />
          ) : (
            <Edit2 size={20} />
          )}
        </button>
      </div>
    </div>
  );

  if (!profileData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-xl bg-gradient-to-b from-[#2c1810] to-[#1a0f0f]
                       rounded-xl shadow-xl border border-amber-900/30 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-32 bg-[url('/images/parchment-texture.jpg')] bg-cover">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 to-[#2c1810]/95">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                                  border-4 border-amber-700 shadow-xl flex items-center justify-center
                                  relative group overflow-hidden">
                      {profileData.avatarUrl ? (
                        <img 
                          src={profileData.avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={32} className="text-amber-100" />
                      )}
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
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 
                           transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pt-16 pb-8 space-y-6">
                {/* Email */}
                <div className="group relative">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                              rounded-lg border border-amber-900/30">
                    <div className="space-y-1">
                      <label className="text-sm text-amber-400 font-medieval flex items-center gap-2">
                        <Mail size={16} />
                        <span>Mystical Address (Email)</span>
                      </label>
                      <p className="text-amber-100 font-crimson">{profileData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="group relative">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                              rounded-lg border border-amber-900/30">
                    <div className="space-y-1">
                      <label className="text-sm text-amber-400 font-medieval flex items-center gap-2">
                        <Scroll size={16} />
                        <span>Guild Rank</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {profileData.subscriptionUntil ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Crown className="w-5 h-5 text-amber-400" />
                              <span className="text-amber-400 font-medieval">Premium Adventurer</span>
                            </div>
                            <span className="text-sm text-amber-500 font-crimson">
                              (until {new Date(profileData.subscriptionUntil).toLocaleDateString()})
                            </span>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CircleDot className="w-5 h-5 text-amber-100/70" />
                            <span className="text-amber-100 font-medieval">Novice Explorer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable fields */}
                {renderEditableField('firstname', 'First Name', profileData.firstname, <User size={16} />)}
                {renderEditableField('lastname', 'Last Name', profileData.lastname, <User size={16} />)}
                {renderEditableField('phone', 'Message Crystal', profileData.phone, <Phone size={16} />)}
                {renderEditableField('city', 'Current Realm', profileData.city, <MapPin size={16} />)}

                <div className="group relative">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                              rounded-lg border border-amber-900/30">
                    <div className="space-y-1">
                      <label className="text-sm text-amber-400 font-medieval flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>Joined the Guild</span>
                      </label>
                      <p className="text-amber-100 font-crimson">
                        {new Date(profileData.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 
                           bg-gradient-to-r from-amber-900/50 to-amber-800/50
                           hover:from-amber-800/50 hover:to-amber-700/50
                           text-amber-100 rounded-lg transition-colors border border-amber-900/30
                           font-medieval"
                  onClick={() => showNotification('info', 'Password change functionality coming soon')}
                >
                  <Lock size={18} />
                  <span>Change Secret Runes (Password)</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;