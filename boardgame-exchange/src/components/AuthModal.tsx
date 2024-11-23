import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Scroll, DoorOpen, UserPlus, Mail, Key, Phone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  phoneNumber?: string;
  terms?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    terms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasMinLength && hasUpperCase && hasNumber;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    return /^[0-9]{9}$/.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!isLogin) {
      if (!validateEmail(formData.email)) {
        newErrors.email = 'Your magical scroll address seems incorrect';
      }

      if (!validatePassword(formData.password)) {
        newErrors.password = 'Your spell requires 8 characters, 1 capital letter, and 1 number';
      }

      if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Your crystal ball number must be 9 digits';
      }

      if (!formData.terms) {
        newErrors.terms = 'You must accept the ancient scrolls of agreement';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formData);
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
              className="w-full max-w-lg bg-gradient-to-b from-[#2c1810] to-[#1a0f0f] 
                         rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden 
                         border border-amber-900/30 mx-4"
            >
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
                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={() => setIsLogin(true)}
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
                    onClick={() => setIsLogin(false)}
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-amber-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border 
                                ${errors.email ? 'border-red-500' : 'border-amber-900/50'}
                                text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500
                                transition-all duration-200`}
                      placeholder="Your Magical Scroll (Email)"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

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
                    />
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border 
                                    ${errors.phoneNumber ? 'border-red-500' : 'border-amber-900/50'}
                                    text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500
                                    transition-all duration-200`}
                          placeholder="Your Crystal Ball Number"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-red-500 text-xs">{errors.phoneNumber}</p>
                        )}
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-amber-900/50 text-amber-600 
                                   focus:ring-amber-500 bg-black/20"
                        />
                        <label className="text-sm text-amber-200">
                          I accept the <button type="button" className="text-amber-500 hover:text-amber-400 underline">Ancient Scrolls of Agreement</button>
                        </label>
                      </div>
                      {errors.terms && (
                        <p className="mt-1 text-red-500 text-xs">{errors.terms}</p>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 
                             rounded-lg hover:from-amber-700 hover:to-amber-900 transform transition-all 
                             duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 
                             focus:ring-amber-500 shadow-lg hover:shadow-amber-900/50 
                             flex items-center justify-center gap-2"
                  >
                    <Scroll size={20} />
                    {isLogin ? "Cast Your Spell" : "Forge Your Legend"}
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

                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 
                              border-amber-900/30 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 
                              border-amber-900/30 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 
                              border-amber-900/30 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 
                              border-amber-900/30 rounded-br-xl" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;