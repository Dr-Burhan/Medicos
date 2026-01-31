import React from 'react';
import { useLocation } from 'react-router-dom';



const Layout = ({ children }) => {
  const location = useLocation();
  const hide = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50">
     
     
      <main className={hide ? 'pt-0' : 'pt-14 sm:pt-16 md:pt-20'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;