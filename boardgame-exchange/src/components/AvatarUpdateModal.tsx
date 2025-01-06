// src/components/AvatarUpdateModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Save } from 'lucide-react';

interface AvatarUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string | null;
  onUpdateAvatar: (url: string) => Promise<void>;
}

const AvatarUpdateModal: React.FC<AvatarUpdateModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onUpdateAvatar
}) => {
  const [newAvatarUrl, setNewAvatarUrl] = useState(currentAvatarUrl || '');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!isValidUrl) return;
    
    setIsLoading(true);
    try {
      await onUpdateAvatar(newAvatarUrl);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#2c1810] to-[#1a0f0f]
                       rounded-xl shadow-xl border border-amber-900/30"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-amber-900/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medieval text-amber-100">Update Avatar</h3>
                  <button
                    onClick={onClose}
                    className="text-amber-400 hover:text-amber-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Current and New Avatar Input */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                               border-4 border-amber-700 shadow-xl overflow-hidden flex-shrink-0">
                    {currentAvatarUrl ? (
                      <img 
                        src={currentAvatarUrl} 
                        alt="Current Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={32} className="text-amber-100" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medieval text-amber-200">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={newAvatarUrl}
                      onChange={(e) => {
                        setNewAvatarUrl(e.target.value);
                        setIsValidUrl(validateUrl(e.target.value));
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-amber-950/50 text-amber-100 rounded px-4 py-3
                             border border-amber-500/30 focus:border-amber-500 
                             focus:outline-none font-crimson"
                    />
                    {newAvatarUrl && !isValidUrl && (
                      <p className="text-sm text-red-400">Please enter a valid image URL</p>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {isValidUrl && newAvatarUrl && (
                  <div className="mb-6">
                    <label className="block text-sm font-medieval text-amber-200 mb-2">
                      Preview
                    </label>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                                border-4 border-amber-700 shadow-xl overflow-hidden mx-auto">
                      <img 
                        src={newAvatarUrl} 
                        alt="New Avatar Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-amber-300 hover:text-amber-200
                             transition-colors font-medieval"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isValidUrl || isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700
                             hover:from-amber-700 hover:to-amber-800
                             text-amber-100 rounded transition-colors font-medieval
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-amber-100 border-t-transparent 
                                    rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Avatar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AvatarUpdateModal;