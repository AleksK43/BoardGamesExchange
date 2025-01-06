import AuthModal from '../../components/AuthModal';
import ProfileModal from '../../components/ProfileModal';
import PremiumModal from '../../components/PremiumModal';
import { useAuth } from '../../providers/AuthProvider';
import { useNotification } from '../../providers/NotificationProvider';
import { UserLevel } from '../../types/user';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Dice1, 
  User, 
  LogOut, 
  ChevronDown, 
  Scroll,
  Settings, 
  Crown,
  Shield
} from 'lucide-react';


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { showNotification } = useNotification();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    showNotification('success', 'You have left the realm. Safe travels!');
    navigate('/');
  };

  const isAdmin = user?.level === UserLevel.ADMIN;
  const isBasicUser = !user?.subscriptionUntil;

  return (
    <>
      <nav className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] border-b border-amber-900/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Dice1 
                size={32} 
                className="text-amber-500 transform group-hover:rotate-180 transition-transform duration-500" 
              />
              <span className="font-medieval text-xl text-amber-100">Board Buddies</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/app/games"
                    className="font-medieval text-amber-100 px-4 py-2 rounded-lg 
                             hover:bg-amber-900/30 transition-all duration-200 
                             hover:text-amber-400 flex items-center gap-2"
                  >
                    <Dice1 size={20} />
                    <span>Magical Collection</span>
                  </Link>

                  <Link 
                    to="/app/games/manage"
                    className="font-medieval text-amber-100 px-4 py-2 rounded-lg 
                             hover:bg-amber-900/30 transition-all duration-200 
                             hover:text-amber-400 flex items-center gap-2"
                  >
                    <Scroll size={20} />
                    <span>Your Scrolls</span>
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/app/admin"
                      className="font-medieval text-amber-100 px-4 py-2 rounded-lg 
                               hover:bg-amber-900/30 transition-all duration-200 
                               hover:text-amber-400 flex items-center gap-2"
                    >
                      <Settings size={20} />
                      <span>Master's Chamber</span>
                    </Link>
                  )}

                  {isBasicUser && (
                    <button
                      onClick={() => setIsPremiumModalOpen(true)}
                      className="font-medieval px-4 py-2 bg-gradient-to-r 
                               from-amber-600 to-amber-800 text-amber-100 rounded-lg 
                               hover:from-amber-700 hover:to-amber-900 
                               transition-all duration-200 flex items-center gap-2 
                               shadow-lg hover:shadow-amber-900/50 transform hover:scale-105"
                    >
                      <Crown size={20} />
                      <span>Unlock Premium</span>
                    </button>
                  )}

                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 
                               rounded-lg hover:bg-amber-900/30 text-amber-100 
                               transition-all duration-200 font-medieval border border-amber-900/30"
                    >
                      {user?.subscriptionUntil ? (
                        <Crown size={20} className="text-amber-400" />
                      ) : (
                        <Shield size={20} className="text-amber-100" />
                      )}
                      <span>{user?.email}</span>
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-[#2c1810] rounded-lg 
                                   shadow-xl border border-amber-900/30 py-1 z-50"
                        >
                          <button
                            onClick={() => {
                              setIsProfileModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-amber-100 
                                     hover:bg-amber-900/30 transition-colors font-medieval 
                                     flex items-center gap-2"
                          >
                            <User size={16} />
                            Character Sheet
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-amber-100 
                                     hover:bg-amber-900/30 transition-colors font-medieval 
                                     flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Leave Realm
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-medieval px-6 py-2 bg-gradient-to-r from-amber-600 
                           to-amber-800 hover:from-amber-700 hover:to-amber-900 
                           text-amber-100 rounded-lg transition-all duration-200 
                           shadow-lg hover:shadow-amber-900/50"
                >
                  Enter Realm
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-amber-100 p-2 hover:bg-amber-900/30 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-amber-900/30"
            >
              <div className="px-4 py-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/app/games"
                      className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                               transition-colors font-medieval"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Magical Collection
                    </Link>
                    <Link
                      to="/app/games/manage"
                      className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                               transition-colors font-medieval"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Scrolls
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/app/admin"
                        className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                                 transition-colors font-medieval"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Master's Chamber
                      </Link>
                    )}
                    {isBasicUser && (
                      <button
                        onClick={() => {
                          setIsPremiumModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                                 hover:bg-amber-900/30 transition-colors font-medieval 
                                 flex items-center gap-2"
                      >
                        <Crown size={20} />
                        Unlock Premium
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                               hover:bg-amber-900/30 transition-colors font-medieval"
                    >
                      Character Sheet
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                               hover:bg-amber-900/30 transition-colors font-medieval"
                    >
                      Leave Realm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                             hover:bg-amber-900/30 transition-colors font-medieval"
                  >
                    Enter Realm
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </>
  );
};

export default Navbar;