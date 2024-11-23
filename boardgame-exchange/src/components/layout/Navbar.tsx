import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Dice1, Repeat, User, LogOut, ChevronDown } from 'lucide-react';
import AuthModal from '../AuthModal';

const Navbar: React.FC = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const navigate = useNavigate();

 // TODO: Replace with actual auth state
 const isAuthenticated = false;

 return (
   <>
     <nav className="bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] border-b border-amber-900/30 relative z-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-16">
           {/* Logo */}
           <div className="flex-shrink-0">
             <Link 
               to="/app/games" 
               className="flex items-center gap-2 group"
             >
               <Dice1 
                 size={32} 
                 className="text-amber-500 transform group-hover:rotate-180 transition-transform duration-500" 
               />
               <span className="font-medieval text-xl font-bold text-amber-100 hover:text-amber-400 
                              transition-colors tracking-wider">
                 BoardGame Exchange
               </span>
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
               <div className="relative">
                 <button
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="font-medieval flex items-center gap-2 px-4 py-2 
                            bg-gradient-to-r from-amber-900/50 to-amber-800/50 
                            text-amber-100 rounded-lg hover:from-amber-800 hover:to-amber-700 
                            transition-all duration-300"
                 >
                   <User size={20} />
                   <span>Profile</span>
                   <ChevronDown 
                     size={16} 
                     className={`transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                   />
                 </button>

                 <AnimatePresence>
                   {isUserMenuOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="absolute right-0 mt-2 w-48 rounded-lg bg-[#2c1810] shadow-lg py-1
                                border border-amber-900/30"
                     >
                       <Link
                         to="/app/profile"
                         className="font-medieval px-4 py-2 text-sm text-amber-100 hover:bg-amber-900/50
                                  transition-colors flex items-center gap-2"
                       >
                         <User size={16} />
                         <span>Your Profile</span>
                       </Link>
                       <button
                         onClick={() => {/* handle logout */}}
                         className="font-medieval w-full text-left px-4 py-2 text-sm text-amber-100 
                                  hover:bg-amber-900/50 transition-colors flex items-center gap-2"
                       >
                         <LogOut size={16} />
                         <span>Leave the Realm</span>
                       </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ) : (
               <button
                 onClick={() => setIsAuthModalOpen(true)}
                 className="font-medieval flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-amber-900 to-amber-800
                          hover:from-amber-800 hover:to-amber-700 
                          text-amber-100 rounded-lg transition-all duration-300
                          hover:shadow-lg hover:shadow-amber-900/50"
               >
                 <User size={20} />
                 <span>Enter the Realm</span>
               </button>
             )}
           </div>

           {/* Mobile menu button */}
           <div className="md:hidden">
             <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="text-amber-100 hover:text-amber-400 transition-colors
                        p-2 rounded-lg hover:bg-amber-900/30"
             >
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
           </div>
         </div>
       </div>

       {/* Mobile Navigation */}
       <AnimatePresence>
         {isMenuOpen && (
           <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="md:hidden border-t border-amber-900/30"
           >
             <div className="px-2 pt-2 pb-3 space-y-1">
               <Link
                 to="/app/games"
                 className="font-medieval px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/50 
                          transition-colors flex items-center gap-2"
               >
                 <Dice1 size={20} />
                 <span>Games</span>
               </Link>
               <Link
                 to="/app/exchange"
                 className="font-medieval px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/50 
                          transition-colors flex items-center gap-2"
               >
                 <Repeat size={20} />
                 <span>Exchange</span>
               </Link>
               {isAuthenticated ? (
                 <>
                   <Link
                     to="/app/profile"
                     className="font-medieval px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-900/50 
                              transition-colors flex items-center gap-2"
                   >
                     <User size={20} />
                     <span>Your Profile</span>
                   </Link>
                   <button
                     onClick={() => {/* handle logout */}}
                     className="font-medieval w-full text-left px-3 py-2 rounded-lg text-amber-100 
                              hover:bg-amber-900/50 transition-colors flex items-center gap-2"
                   >
                     <LogOut size={20} />
                     <span>Leave the Realm</span>
                   </button>
                 </>
               ) : (
                 <button
                   onClick={() => {
                     setIsAuthModalOpen(true);
                     setIsMenuOpen(false);
                   }}
                   className="font-medieval w-full px-3 py-2 rounded-lg text-amber-100 
                            hover:bg-amber-900/50 transition-colors flex items-center gap-2"
                 >
                   <User size={20} />
                   <span>Enter the Realm</span>
                 </button>
               )}
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </nav>

     <AuthModal 
       isOpen={isAuthModalOpen} 
       onClose={() => setIsAuthModalOpen(false)} 
     />
   </>
 );
};

export default Navbar;