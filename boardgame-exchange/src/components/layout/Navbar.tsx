import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dice1, User, LogOut, ChevronDown, PlusCircle, Settings } from 'lucide-react';
import AuthModal from '../AuthModal';
import ProfileModal from '../ProfileModal';
import { useAuth } from '../../providers/AuthProvider';
import { useNotification } from '../../providers/NotificationProvider';
import { UserLevel } from '../../types/user';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { showNotification } = useNotification();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    showNotification('success', 'Successfully logged out');
    navigate('/');
  };

  const isAdmin = user?.level === UserLevel.ADMIN;

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
            <div className="hidden md:flex md:items-center md:gap-8">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/app/games"
                    className="font-medieval text-amber-100 hover:text-amber-400 transition-colors 
                             flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-900/30"
                  >
                    <Dice1 size={20} />
                    <span>Games</span>
                  </Link>

                  <Link 
                  to="/app/games/manage"
                  className="font-medieval text-amber-100 hover:text-amber-400 transition-colors 
                  flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-900/30"
                  >
                    <PlusCircle size={20} />
                    <span>Manage Games</span>
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/app/admin"
                      className="font-medieval text-amber-100 hover:text-amber-400 transition-colors 
                               flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-900/30"
                    >
                      <Settings size={20} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {/* Profile Menu */}
                  <div className="relative z-50">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 rounded-lg 
                               hover:bg-amber-900/30 text-amber-100 transition-colors"
                    >
                      <User size={20} />
                      <span className="font-medieval">{user?.email}</span>
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
                          className="absolute right-0 mt-2 w-48 bg-[#2c1810] rounded-lg shadow-xl 
                                   border border-amber-900/30 py-1 z-50"
                        >
                          <button
                            onClick={() => {
                              setIsProfileModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-900/30 
                                     transition-colors font-medieval flex items-center gap-2"
                          >
                            <User size={16} />
                            Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-amber-100 hover:bg-amber-900/30 
                                     transition-colors font-medieval flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-medieval px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-800
                           hover:from-amber-800 hover:to-amber-900 text-amber-100 rounded-lg 
                           transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden relative z-50">
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
              className="md:hidden border-t border-amber-900/30 relative z-40 bg-[#1a0f0f]"
            >
              <div className="px-4 py-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/app/games"
                      className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                               transition-colors font-medieval"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Games
                    </Link>
                    <Link
                      to="/app/games/add"
                      className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                               transition-colors font-medieval"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Game
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/app/admin"
                        className="block px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/30
                                 transition-colors font-medieval"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                               hover:bg-amber-900/30 transition-colors font-medieval"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-amber-100 
                               hover:bg-amber-900/30 transition-colors font-medieval"
                    >
                      Logout
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
                    Login
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
    </>
  );
};

export default Navbar;