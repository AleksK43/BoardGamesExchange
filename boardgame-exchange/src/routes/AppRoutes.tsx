import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import  GamesPage  from '../pages/GamesPage';
import PageTransition from '../components/PageTransition';
import { useTransition } from '../hooks/useTransition';

const AppRoutes = () => {
  const location = useLocation();
  const { isNavigating } = useTransition();

  return (
    <AnimatePresence mode="wait">
      <PageTransition isNavigating={isNavigating}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          {/* Dodaj więcej ścieżek */}
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

export default AppRoutes;