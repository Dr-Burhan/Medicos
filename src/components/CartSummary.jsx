import React from 'react';

const CartSummary = ({ cart, onCheckout, isCheckoutDisabled }) => {
  const subtotal = cart?.totalPrice || 0;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            £{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Shipping
            {shippingCost === 0 && (
              <span className="text-green-600 text-sm ml-2">(Free)</span>
            )}
          </span>
          <span className="font-semibold text-gray-900">
            £{shippingCost.toFixed(2)}
          </span>
        </div>
        {shippingCost > 0 && (
          <p className="text-sm text-green-600">
            Free shipping on orders over £50!
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            £{total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
          isCheckoutDisabled
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Proceed to Checkout
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Free returns within 30 days
      </p>
    </div>
  );
};

export default CartSummary;
