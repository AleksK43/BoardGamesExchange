// src/routes/AppRoutes.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import GamesPage from '../pages/GamesPage';
import PageTransition from '../components/PageTransition';
import { useTransition } from '../hooks/useTransition';
import AddGame from '../pages/Games/components/AddGame';
import MyGames from '../pages/Games/components/MyGames';

const AppRoutes = () => {
  const location = useLocation();
  const { isNavigating } = useTransition();

  return (
    <AnimatePresence mode="wait">
      <PageTransition isNavigating={isNavigating}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          {/* Zagnieżdżone ścieżki dla sekcji games */}
          <Route path="/app/games">
            <Route path="add" element={<AddGame />} />
            <Route path="my-games" element={<MyGames />} />
          </Route>
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

export default AppRoutes;