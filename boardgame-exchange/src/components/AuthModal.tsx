import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Scroll, DoorOpen, UserPlus, Mail, Key, User } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  login?: string;
  email?: string;
  password?: string;
  general?: string;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const navigate = useNavigate();
  const { login: authLogin, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateLogin = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.login) {
      newErrors.login = 'Login is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const validateRegistration = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = isLogin ? validateLogin() : validateRegistration();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await authLogin(formData.login, formData.password);
        onClose();
        navigate('/app/games');
      } else {
        await register(formData.email, formData.password);
        onClose();
        navigate('/app/games');
      }
    } catch (error) {
      setErrors({
        general: isLogin 
          ? error instanceof Error ? error.message : 'Login failed'
          : 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ login: '', email: '', password: '' });
    setErrors({});
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] rounded-xl 
                         shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden border border-amber-900/30 mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-32 bg-[url('/images/parchment-texture.jpg')] bg-cover">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 to-[#2c1810]/95">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                                  border-4 border-amber-700 shadow-xl flex items-center justify-center">
                      <Shield size={40} className="text-amber-100" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-amber-200 hover:text-amber-100 
                             transition-colors bg-black/20 p-1 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-8 pt-16 pb-8">
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                    {errors.general}
                  </div>
                )}

                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={() => switchMode()}
                    className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                              ${isLogin 
                                ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 shadow-lg' 
                                : 'bg-transparent border border-amber-800/50 text-amber-600 hover:bg-amber-900/20'
                              }`}
                  >
                    <DoorOpen size={20} />
                    <span>Enter the Realm</span>
                  </button>
                  <button
                    onClick={() => switchMode()}
                    className={`flex-1 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                              ${!isLogin 
                                ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 shadow-lg' 
                                : 'bg-transparent border border-amber-800/50 text-amber-600 hover:bg-amber-900/20'
                              }`}
                  >
                    <UserPlus size={20} />
                    <span>Begin Journey</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Login/Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {isLogin ? <User className="h-5 w-5 text-amber-500" /> : <Mail className="h-5 w-5 text-amber-500" />}
                    </div>
                    <input
                      type={isLogin ? "text" : "email"}
                      name={isLogin ? "login" : "email"}
                      value={isLogin ? formData.login : formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border 
                                ${(errors.login || errors.email) ? 'border-red-500' : 'border-amber-900/50'}
                                text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500
                                transition-all duration-200`}
                      placeholder={isLogin ? "Your Username" : "Your Email"}
                      disabled={loading}
                    />
                    {errors.login && isLogin && (
                      <p className="mt-1 text-red-500 text-xs">{errors.login}</p>
                    )}
                    {errors.email && !isLogin && (
                      <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-amber-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border 
                                ${errors.password ? 'border-red-500' : 'border-amber-900/50'}
                                text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500
                                transition-all duration-200`}
                      placeholder="Your Secret Spell (Password)"
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 
                             rounded-lg transform transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg 
                             hover:shadow-amber-900/50 flex items-center justify-center gap-2
                             ${loading 
                               ? 'opacity-70 cursor-not-allowed' 
                               : 'hover:from-amber-700 hover:to-amber-900 hover:scale-[1.02]'}`}
                  >
                    <Scroll size={20} />
                    {loading ? "Casting Spell..." : (isLogin ? "Cast Your Spell" : "Forge Your Legend")}
                  </button>
                </form>

                {isLogin && (
                  <button
                    className="mt-4 w-full text-sm text-amber-500 hover:text-amber-400 
                             transition-colors text-center"
                  >
                    Lost your mystical password?
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;