import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, LogOut, Settings, Package, Grid, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const hasUser = user !== null && user !== undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!hasUser) {
    return (
      <motion.button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </motion.button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden lg:flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
            {user?.name || 'User'}
          </span>
          {user?.role === 'admin' && (
            <span className="text-xs text-blue-600 font-medium">Admin</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 hidden lg:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* User Info Section */}
            <div className="p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-base">{user?.name || 'User'}</p>
                  <p className="text-sm text-blue-100 truncate">{user?.email}</p>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="mt-3">
                  <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                    Administrator
                  </span>
                </div>
              )}
            </div>

            <div className="py-2">
              {/* Account Settings */}
              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 focus:outline-none focus-visible:bg-gray-100"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Account Settings</span>
              </button>

              {/* Admin Management Section */}
              {user?.role === "admin" && (
                <>
                  <div className="my-2 border-t border-gray-200" />
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin Management
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigation("/admin/users")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-colors duration-150 group focus:outline-none focus-visible:bg-blue-50"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">User Management</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/admin/products")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-colors duration-150 group focus:outline-none focus-visible:bg-blue-50"
                  >
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Product Management</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/admin/collections")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition-colors duration-150 group focus:outline-none focus-visible:bg-blue-50"
                  >
                    <Grid className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Collection Management</span>
                  </button>
                </>
              )}

              {/* Logout */}
              <div className="my-2 border-t border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-150 focus:outline-none focus-visible:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;