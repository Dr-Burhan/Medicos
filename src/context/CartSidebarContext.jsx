import React, { createContext, useContext, useState } from 'react';

const CartSidebarContext = createContext();

export const CartSidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  return (
    <CartSidebarContext.Provider value={{ isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartSidebarContext.Provider>
  );
};

export const useCartSidebar = () => {
  const context = useContext(CartSidebarContext);
  if (!context) {
    throw new Error('useCartSidebar must be used within CartSidebarProvider');
  }
  return context;
};