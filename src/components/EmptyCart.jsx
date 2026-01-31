import React from 'react';
import { ShoppingCart } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6">
        <ShoppingCart className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Looks like you haven't added any items to your cart yet. 
        Start shopping to find products you love!
      </p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
      >
        Continue Shopping
      </a>
    </div>
  );
};

export default EmptyCart;
