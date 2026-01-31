import React, { useState } from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProductManagement from './pages/ProductManagement.jsx'
import CollectionManagement from './pages/CollectionManagement.jsx'
import { Collections } from './pages/Collections.jsx'
import { Products, ProductDetailPage } from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CartSidebarProvider, useCartSidebar } from './context/CartSidebarContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Orders from './pages/Orders.jsx'
import ProfilePage from './pages/Profile.jsx'
import UserManagementPage from './pages/UserManagementPage.jsx';
import  Layout  from './components/Layout.jsx';

const AppContent = () => {
  const location = useLocation()
  const { isOpen, closeCart } = useCartSidebar()
  const hideLayout = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div>
      {!hideLayout && <Navbar />}
      <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/collections" 
          element={
          
              <CollectionManagement />
            
          } 
        />
        
        {/* Public Routes */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetailPage/>} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        
      </Routes>  

      {!hideLayout && <Footer />}
      </Layout> 

      <CartSidebar isOpen={isOpen} onClose={closeCart} />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CartSidebarProvider>
          <AppContent />
        </CartSidebarProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App