import React from 'react';

// Wrapper component for your home page
// Use this to wrap your home page content

const HomePageWrapper = ({ children }) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen">
      {/* Add padding top to account for fixed navbar */}
      <div className="pt-14 sm:pt-16 md:pt-20 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default HomePageWrapper;