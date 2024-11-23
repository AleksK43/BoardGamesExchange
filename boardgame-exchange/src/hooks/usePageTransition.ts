import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (to: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(to);
      setTimeout(() => {
        setIsNavigating(false);
      }, 800); // Wydłużony czas na zakończenie animacji
    }, 800); // Wydłużony czas przed rozpoczęciem nawigacji
  };

  useEffect(() => {
    setIsNavigating(false);
  }, [location]);

  return { isNavigating, handleNavigation };
};