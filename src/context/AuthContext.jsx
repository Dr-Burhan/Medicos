import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount (verify JWT via cookie)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // This endpoint should verify the JWT cookie and return user data
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        withCredentials: true,
      });

      console.log('✅ Auth check response:', response.data);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', response.data.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.log('❌ Auth check failed:', error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log('Login response:', response.data);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('✅ Login successful, user:', response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Call backend logout to clear HTTP-only cookie
      await axios.post(
        `${API_BASE_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error during logout. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Refresh auth - useful for after login/register to update all components
  const refreshAuth = async () => {
    await checkAuth();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAuth, // Export this so components can manually refresh
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};