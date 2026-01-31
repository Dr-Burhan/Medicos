import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Search, User, ChevronRight, Settings, Package, Grid, Users } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartSidebar } from "../context/CartSidebarContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Navbar = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { openCart } = useCartSidebar();
  const { user } = useAuth();
  const { cartItemsCount } = useCart();
  const hasUser = user !== null && user !== undefined;

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Collections", path: "/collections" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-screen-l mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Mobile Menu Toggle - Left side on mobile */}
            <div className="md:hidden flex items-center flex-shrink-0">
              <button
                onClick={toggleMenu}
                className="focus:outline-none p-1.5 text-black hover:bg-gray-100 rounded transition"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Logo - Responsive sizing and positioning */}
            <motion.div
              className="flex items-center gap-2 sm:gap-3 flex-1 justify-center md:flex-none md:justify-start cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
            >
              {/* Logo Icon */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Brand Name */}
              <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Medicos
              </span>
            </motion.div>

            {/* Desktop Menu - Hidden on Mobile and Tablet */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {menuItems.map((item) => (
  <motion.button
    key={item.label}
    onClick={() => navigate(item.path)}
    className="font-medium relative group text-sm xl:text-base transition-colors text-black hover:text-blue-600 whitespace-nowrap"
    whileHover={{ scale: 1.05 }}
  >
    {item.label}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
  </motion.button>
))}

            </div>

            {/* Desktop Right Section - Hidden on Mobile, Shown on Tablet */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0">
              {/* Search Bar - Hidden on small tablets, visible from md up */}
              <motion.div
                className="hidden md:flex relative border border-gray-300 rounded-full px-2 sm:px-3 md:px-4 py-2 items-center gap-2 bg-white w-32 sm:w-40 md:w-48 lg:w-48 xl:w-56"
                whileHover={{ borderColor: "#3b82f6" }}
              >
                <Search className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-xs md:text-sm text-gray-900 placeholder:text-gray-500 flex-1 truncate"
                />
              </motion.div>

              {/* Desktop User Dropdown - Hidden on mobile */}
              <div className="hidden md:block">
                <UserDropdown />
              </div>

              {/* Shopping Cart */}
              <motion.div
                onClick={openCart}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Mobile Right Section - Cart Only */}
            <div className="md:hidden flex items-center gap-2 flex-shrink-0">
              {/* Mobile Cart */}
              <motion.div
                onClick={openCart}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="currentColor"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      Medicos
                    </span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded transition"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>

                {/* User Info Section */}
                {hasUser ? (
                  <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {user?.email}
                        </p>
                        {user?.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                    <button
                     onClick={()=> navigate('/login')}
                    className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Sign In

                    </button>
                  </div>
                )}

                {/* Mobile Search Bar */}
                <div className="p-4 sm:p-5 border-b border-gray-200">
                  <div className="relative bg-white border border-gray-300 rounded-full px-3 sm:px-4 py-2.5 flex items-center gap-2">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products"
                      className="bg-transparent outline-none text-sm sm:text-base text-black placeholder:text-gray-500 w-full"
                    />
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 sm:p-3">
                    {/* Main Navigation */}
                    <div className="mb-2">
                      {menuItems.map((item) => (
  <motion.button
    key={item.label}
    onClick={() => {
      navigate(item.path);
      toggleMenu();
    }}
    className="flex items-center justify-between py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors group w-full text-left"
    whileHover={{ x: 5 }}
  >
    <span>{item.label}</span>
    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
  </motion.button>
))}

                    </div>

                    {/* Admin Section - Show if user is admin */}
                    {hasUser && user?.role === "admin" && (
                      <>
                        <div className="my-3 border-t border-gray-200" />
                        <div className="mb-2">
                          <p className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Admin Management
                          </p>
                          
                          <motion.a
                            href="/admin/users"
                            className="flex items-center gap-3 py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                            whileHover={{ x: 5 }}
                            onClick={toggleMenu}
                          >
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="flex-1">User Management</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.a>

                          <motion.a
                            href="/admin/products"
                            className="flex items-center gap-3 py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                            whileHover={{ x: 5 }}
                            onClick={toggleMenu}
                          >
                            <Package className="w-5 h-5 text-blue-600" />
                            <span className="flex-1">Product Management</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.a>

                          <motion.a
                            href="/admin/collections"
                            className="flex items-center gap-3 py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                            whileHover={{ x: 5 }}
                            onClick={toggleMenu}
                          >
                            <Grid className="w-5 h-5 text-blue-600" />
                            <span className="flex-1">Collection Management</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.a>
                        </div>
                      </>
                    )}

                    {/* User Account Section */}
                    {hasUser && (
                      <>
                        <div className="my-3 border-t border-gray-200" />
                        <div className="mb-2">
                          <motion.a
                            href="/profile"
                            className="flex items-center gap-3 py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors group"
                            whileHover={{ x: 5 }}
                            onClick={toggleMenu}
                          >
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="flex-1">Account Settings</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.a>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sidebar Footer */}
                {hasUser && (
                  <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50">
                    <button 
                    onClick={async () => {
                  await logout();
                   navigate("/");
                  if(success){
                    toast.success("Logged out successfully!", {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  }
                   
      }}
                    className="w-full py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;