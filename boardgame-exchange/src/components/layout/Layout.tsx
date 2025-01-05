// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a0f0f]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};