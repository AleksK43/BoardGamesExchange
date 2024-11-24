import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dice1, Repeat, User, LogOut, ChevronDown } from 'lucide-react';
import AuthModal from '../AuthModal';
import ProfileModal from '../ProfileModal';

interface ProfileData {
  avatarUrl?: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData] = useState<ProfileData>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const isAuthenticated = true;

  return (
    <>
      <nav className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] border-b border-amber-900/30 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/app/games" className="flex items-center gap-2 group">
                <Dice1 
                  size={32} 
                  className="text-amber-500 transform group-hover:rotate-180 transition-transform duration-500" 
                />
                <span className="font-medieval text-xl text-amber-100">GameName</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/app/games"
                className="font-medieval text-amber-100 hover:text-amber-400 transition-colors 
                         flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-900/30"
              >
                <Dice1 size={20} />
                <span>Games</span>
              </Link>
              <Link 
                to="/app/exchange"
                className="font-medieval text-amber-100 hover:text-amber-400 transition-colors 
                         flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-900/30"
              >
                <Repeat size={20} />
                <span>Exchange</span>
              </Link>
              
              {isAuthenticated ? (
                <div className="relative flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 border-2 border-amber-500/50
                               flex items-center justify-center overflow-hidden">
                    {profileData?.avatarUrl ? (
                      <img 
                        src={profileData.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-amber-500" />
                    )}
                  </div>

                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="font-medieval flex items-center gap-2 px-4 py-2 
                             bg-gradient-to-r from-amber-900/50 to-amber-800/50 
                             text-amber-100 rounded-lg hover:from-amber-800 hover:to-amber-700 
                             transition-all duration-300"
                  >
                    <span>Profile</span>
                    <ChevronDown 
                      size={16} 
                      className={`transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-lg 
                                 bg-gradient-to-b from-[#2c1810] to-[#1a0f0f]
                                 shadow-lg border border-amber-900/30 overflow-hidden"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsProfileModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-amber-100 
                                     hover:bg-amber-900/30 transition-colors
                                     flex items-center gap-2"
                          >
                            <User size={16} />
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              // Handle logout
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-amber-100 
                                     hover:bg-amber-900/30 transition-colors
                                     flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-medieval px-4 py-2 bg-amber-600 text-amber-100 
                           rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-amber-100 hover:text-amber-400 transition-colors"
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/app/games"
                  className="block px-3 py-2 rounded-md text-amber-100 hover:text-amber-400 
                           hover:bg-amber-900/30 transition-colors"
                >
                  Games
                </Link>
                <Link
                  to="/app/exchange"
                  className="block px-3 py-2 rounded-md text-amber-100 hover:text-amber-400 
                           hover:bg-amber-900/30 transition-colors"
                >
                  Exchange
                </Link>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-amber-100 
                               hover:text-amber-400 hover:bg-amber-900/30 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        // Handle logout
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-amber-100 
                               hover:text-amber-400 hover:bg-amber-900/30 transition-colors"
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
                    className="w-full text-left px-3 py-2 rounded-md text-amber-100 
                             hover:text-amber-400 hover:bg-amber-900/30 transition-colors"
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