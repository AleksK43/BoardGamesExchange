import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/app') {
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[#1a0f0f]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;