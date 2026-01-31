import React from 'react';
import { Package, ShoppingBag, RefreshCw, X, Search, DollarSign } from 'lucide-react';

const OrdersTab = ({ isAdmin, searchQuery, setSearchQuery }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {isAdmin ? 'All Orders' : 'My Orders'}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Track and manage your order history</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Processing</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Shipped</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 bg-green-50 p-1.5 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Delivered</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 bg-red-50 p-1.5 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Cancelled</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Cash on Delivery</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 bg-purple-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Spent</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">£0.00</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <select className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 text-sm sm:text-base">
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline text-sm sm:text-base">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Start shopping to see your orders here</p>
        <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base">
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default OrdersTab;