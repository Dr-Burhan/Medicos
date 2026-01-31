import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    if (Array.isArray(imageData)) return imageData[0]?.url || null;
    if (typeof imageData === 'string') return imageData;
    if (typeof imageData === 'object' && imageData.url) return imageData.url;
    return null;
  };

  const handleIncreaseQuantity = () => {
    if (item.quantity < product.stock) {
      updateQuantity(product._id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(product._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product._id);
  };

  const imageUrl = getImageUrl(product.images);

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200 hover:bg-gray-50 p-4 rounded-lg transition">
      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <p className="font-bold text-lg text-gray-900">£{item.price.toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={handleDecreaseQuantity}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            disabled={item.quantity >= product.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600 mt-1">
            Subtotal: <span className="font-bold text-gray-900">£{(item.price * item.quantity).toFixed(2)}</span>
          </p>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2  rounded transition flex items-center gap-1 ml-5 "
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
