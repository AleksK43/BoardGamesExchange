import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import GamesPage from '../pages/GamesPage';
import AddGame from '../pages/Games/components/AddGame';
import AdminPanel from '../pages/AdminPanel/AdminPanel';
import { useLoading } from '../providers/LoadingProvider';
import { Layout } from '../components/layout/Layout';

const AppRoutes = () => {
  const location = useLocation();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleNavigation = async () => {
      startLoading();
      timeout = setTimeout(() => {
        stopLoading();
      }, 800);
    };

    handleNavigation();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [location.pathname, startLoading, stopLoading]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<Layout />}>
          <Route path="games" element={<GamesPage />} />
          <Route path="games/manage" element={<AddGame />} />
          <Route path="admin">
            <Route path="panel" element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;