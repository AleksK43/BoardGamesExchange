// src/providers/NotificationProvider.tsx
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, XCircle, Scroll, Flame } from 'lucide-react';
import { useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <Shield className="w-6 h-6 text-amber-400" />;
    case 'error':
      return <Flame className="w-6 h-6 text-red-400" />;
    case 'warning':
      return <XCircle className="w-6 h-6 text-amber-400" />;
    case 'info':
      return <Scroll className="w-6 h-6 text-amber-400" />;
  }
};

const getBackgroundStyle = (type: NotificationType): string => {
  const baseStyle = 'border shadow-lg backdrop-blur-sm';
  switch (type) {
    case 'success':
      return `${baseStyle} bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-500/50`;
    case 'error':
      return `${baseStyle} bg-gradient-to-r from-red-900/80 to-red-800/80 border-red-500/50`;
    case 'warning':
      return `${baseStyle} bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-500/50`;
    case 'info':
      return `${baseStyle} bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-500/50`;
  }
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).slice(2, 11);
    setNotifications(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4 min-w-[320px] max-w-[420px]">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`${getBackgroundStyle(notification.type)} 
                         rounded-lg p-4 flex items-center gap-3
                         shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
            >
              {getIcon(notification.type)}
              <p className="text-amber-100 font-medieval flex-1">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-amber-400/70 hover:text-amber-400 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};