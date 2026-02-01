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
    const checkAuth = async () => {
      try {
        // This endpoint should verify the JWT cookie and return user data
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Not authenticated:', error.message);
        // Don't set to false here - let the app check based on user state
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
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
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
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
                                  autoClose: 3000,});
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error during logout. Please try again.", {
                                  position: "top-right",
                                  autoClose: 3000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
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
