import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

const CartContext = createContext();
const API_BASE_URL = 'http://localhost:8000/api';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateTimeoutRef = useRef({});
  const lastUpdatedRef = useRef({});
  const isFetchingRef = useRef(false);

  // Fetch cart from backend
  const fetchCart = useCallback(async (silent = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      if (!silent) setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/cart/get-cart`, { 
        withCredentials: true 
      });
      
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      // Only set error if it's not a 401 (user not logged in)
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Add to cart with optimistic update
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setError(null);
      
      // Optimistic update - add item to cart immediately
      setCart(prev => {
        if (!prev) {
          return { items: [], totalPrice: 0 };
        }
        
        // Check if item already exists
        const existingItemIndex = prev.items.findIndex(
          item => item.product._id === productId
        );
        
        if (existingItemIndex > -1) {
          // Item exists, increase quantity
          const updatedItems = [...prev.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          
          const totalPrice = updatedItems.reduce(
            (sum, i) => sum + i.price * i.quantity, 
            0
          );
          
          return { ...prev, items: updatedItems, totalPrice };
        }
        
        return prev;
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/cart/add-to-cart`, 
        { productId, quantity }, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setCart(response.data.cart);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMsg);
      // Revert optimistic update by refetching
      await fetchCart(true);
      return { success: false, error: errorMsg };
    }
  }, [fetchCart]);

  // Update quantity with stable optimistic updates
  const updateQuantity = useCallback(async (productId, quantity) => {
    setError(null);

    if (!cart) return { success: false };

    // Record last optimistic update
    lastUpdatedRef.current[productId] = quantity;

    // Optimistic update
    setCart(prev => {
      if (!prev) return prev;
      const items = prev.items.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...prev, items, totalPrice };
    });

    // Debounce API call
    if (updateTimeoutRef.current[productId]) {
      clearTimeout(updateTimeoutRef.current[productId]);
    }

    updateTimeoutRef.current[productId] = setTimeout(async () => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/cart/update-cart-item`, 
          { productId, quantity }, 
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.cart) {
          const serverCart = response.data.cart;

          // Merge server cart but preserve latest local quantity
          setCart(prev => {
            if (!prev) return serverCart;

            const mergedItems = prev.items.map(item => {
              const serverItem = serverCart.items.find(
                i => i.product._id === item.product._id
              );
              if (!serverItem) return item;

              const lastLocalQty = lastUpdatedRef.current[item.product._id];
              return {
                ...serverItem,
                quantity: lastLocalQty !== undefined ? lastLocalQty : serverItem.quantity,
              };
            });

            const totalPrice = mergedItems.reduce(
              (sum, i) => sum + i.price * i.quantity, 
              0
            );
            return { ...prev, items: mergedItems, totalPrice };
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update quantity');
        await fetchCart(true);
      }
    }, 400);

    return { success: true };
  }, [cart, fetchCart]);

  // Remove item with optimistic update
  const removeFromCart = useCallback(async (productId) => {
    setError(null);
    const previousCart = cart;

    // Optimistic removal
    setCart(prev => {
      if (!prev) return prev;
      const items = prev.items.filter(i => i.product._id !== productId);
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...prev, items, totalPrice };
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/remove-from-cart`, 
        { productId }, 
        { withCredentials: true }
      );
      
      if (response.data.success && response.data.cart) {
        setCart(response.data.cart);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setCart(previousCart);
      setError(err.response?.data?.message || 'Failed to remove item');
      return { success: false };
    }
  }, [cart]);

  // Clear cart
  const clearCartItems = useCallback(async () => {
    setError(null);
    const previousCart = cart;
    
    // Optimistic clear
    setCart({ items: [], totalPrice: 0 });
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/clear-cart`, 
        {}, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setCart(response.data.cart);
        return { success: true, message: 'Cart cleared successfully' };
      }
    } catch (err) {
      setCart(previousCart);
      setError(err.response?.data?.message || 'Failed to clear cart');
      return { success: false };
    }
  }, [cart]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      Object.values(updateTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartItems,
        cartItemsCount: cart?.items?.length || 0,
        cartTotal: cart?.totalPrice || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};