import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, loading, error } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState(null);
  const [localError, setLocalError] = useState(error);

  /* ===============================
     Disable homepage scroll (X + Y)
     UI NOT TOUCHED
  =============================== */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ===============================
     Sync error from context
  =============================== */
  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const items = cart?.items || [];
  const isEmpty = items.length === 0;
  const total = cart?.totalPrice || 0;

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    if (Array.isArray(imageData)) return imageData[0]?.url || null;
    if (typeof imageData === 'string') return imageData;
    if (typeof imageData === 'object' && imageData.url) return imageData.url;
    return null;
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFromCart(productId);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };

  return (
    <>
     
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={onClose}
        />
      )}

      {/* Sidebar (UNCHANGED UI) */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Your cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{localError}</p>
            </div>
            <button
              onClick={() => setLocalError('')}
              className="flex shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {!user ? (
            /* NOT LOGGED IN */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4">
                <LogIn className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sign in to your account
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to add items to your cart
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-3 flex items-center justify-center gap-2 w-full"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/register');
                }}
                className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2 w-full"
              >
                Create Account
              </button>
            </div>
          ) : isEmpty ? (
            /* EMPTY CART */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added anything yet
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Continue shopping
              </button>
              <p className="text-xs text-gray-500 mt-6">
                Free shipping for all orders over £1000!
              </p>
            </div>
          ) : (
            <>
              {/* Items List (UNCHANGED) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => {
                  const imageUrl = getImageUrl(item.product?.images);
                  const itemTotal = (item.price || 0) * (item.quantity || 1);

                  return (
                    <div
                      key={item.product?._id}
                      className="flex gap-4 border-b border-gray-200 pb-4"
                    >
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingCart className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          £{(item.price || 0).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product?._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={loading || item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-gray-900 px-2 py-1 bg-gray-100 rounded min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product?._id,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={loading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          £{itemTotal.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product?._id)}
                        disabled={removingId === item.product?._id}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer (UNCHANGED) */}
              <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    £{total.toFixed(2)}
                  </span>
                </div>

                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg ">
                  {total >= 1000 ? (
                    <p className="text-green-700 font-medium">
                      ✓ Free shipping on this order
                    </p>
                  ) : (
                    <p>
                      Free shipping for orders over £1000. You need £
                      {(1000 - total).toFixed(2)} more.
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 mb-9 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
