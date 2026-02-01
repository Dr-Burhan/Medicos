import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Check, ShoppingCart, Heart, AlertCircle, X, Truck, Shield, RotateCcw, ChevronRight, ZoomIn, Share2, Package, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCartSidebar } from '../context/CartSidebarContext';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to extract image URL from product
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  if (typeof imageData === 'string') return imageData;
  if (typeof imageData === 'object' && imageData.url) return imageData.url;
  return null;
};

export const API = {
  getProductsByCollection: async (collectionId, page = 1, limit = 12) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/collections/${collectionId}/products`);
      return { 
        success: response.data.success || true, 
        data: response.data.data || response.data || {} 
      };
    } catch (error) {
      console.error('Error fetching products by collection:', error);
      return { success: false, error: error.message };
    }
  },
  getAllProducts: async (page = 1, limit = 12) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/get-allproducts`);
      return { 
        success: response.data.success || true, 
        data: response.data.data || response.data || {} 
      };
    } catch (error) {
      console.error('Error fetching all products:', error);
      return { success: false, error: error.message };
    }
  }
};

export const Products = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [cartSuccess, setCartSuccess] = useState({});
  
  const { addToCart } = useCart();
  const { openCart } = useCartSidebar();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let response;
        if (id) {
          response = await API.getProductsByCollection(id, page, 12);
          if (response.success && response.data.collection) {
            setCollectionName(response.data.collection.name || '');
          }
        } else {
          response = await API.getAllProducts(page, 12);
          setCollectionName('All Products');
        }

        if (response.success) {
          let productsData = [];
          let paginationData = null;

          if (response.data.products) {
            productsData = response.data.products;
            paginationData = response.data.pagination;
          } else if (Array.isArray(response.data)) {
            productsData = response.data;
          } else if (response.data.data) {
            productsData = Array.isArray(response.data.data) ? response.data.data : response.data.data.products || [];
            paginationData = response.data.data.pagination;
          }

          setProducts(productsData);
          setPagination(paginationData);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
      setLoading(false);
    };
    
    load();
  }, [id, page]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (e, productId, productName) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    const result = await addToCart(productId, 1);

    if (result.success) {
      setCartSuccess(prev => ({ ...prev, [productId]: true }));
      
      toast.success(`${productName} added to cart!`, {
        position: 'top-right',
        autoClose: 2000,
      });

      setTimeout(() => {
        openCart();
      }, 300);

      setTimeout(() => {
        setCartSuccess(prev => ({ ...prev, [productId]: false }));
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to add to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/collections')} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Collections</span>
        </button>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {collectionName || 'Products'}
          </h2>
          <p className="text-gray-600 text-lg">
            {id ? 'Browse products in this collection' : 'Browse all our products'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this collection.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => {
                const productId = product._id || product.id;
                const productName = product.title || product.name || 'Unnamed Product';
                const productImage = Array.isArray(product.images) && product.images.length > 0 
                  ? getImageUrl(product.images[0])
                  : product.image;
                
                const rawPrice = product.price || 0;
                const productPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice) || 0;
                
                const productRating = product.rating || 4.5;
                const productReviews = product.reviews || 0;
                const inStock = product.stock > 0;
                const isAdding = addingToCart[productId];
                const showSuccess = cartSuccess[productId];

                return (
                  <div 
                    key={productId} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group" 
                  >
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      {productImage ? (
                        <img 
                          src={productImage} 
                          alt={productName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-sm text-center px-4">{productName}</span>
                        </div>
                      )}
                      
                      <button 
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 z-10 transition-colors" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          toggleFavorite(productId);
                        }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${favorites.includes(productId) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </button>
                      
                      {!inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 
                        className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                        onClick={() => navigate(`/products/${productId}`)}
                      >
                        {productName}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(productRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({productReviews})</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900">${productPrice.toFixed(2)}</span>
                        {product.featured && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, productId, productName)}
                        disabled={!inStock || isAdding || showSuccess}
                        className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          showSuccess
                            ? 'bg-green-600 text-white'
                            : !inStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {showSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added
                          </>
                        ) : isAdding ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Adding...
                          </>
                        ) : !inStock ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    onClick={() => setPage(i + 1)} 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === i + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
                  disabled={page === pagination.totalPages} 
                  className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ==================== PRODUCT DETAIL PAGE ====================

export const ProductDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { openCart } = useCartSidebar();
  const { user } = useAuth();
  
  const id = params.id || params.productId;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/products/get-product/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product`);
        }
        
        const data = await response.json();
        const productData = data.product || data.data || data;
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!product?._id) {
      toast.error('Error: Product ID not found', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsAddingToCart(true);
    
    const result = await addToCart(product._id, quantity);
    
    if (result.success) {
      setShowSuccess(true);
      setQuantity(1);
      
      toast.success('Added to cart successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      
      setTimeout(() => {
        openCart();
      }, 300);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to add to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    
    setIsAddingToCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:gap-3"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold tracking-tight">Back</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl animate-pulse shadow-xl"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-12 bg-slate-200 rounded-2xl animate-pulse w-3/4"></div>
                <div className="h-6 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-5/6"></div>
              </div>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 w-6 bg-slate-200 rounded-full animate-pulse"></div>
                ))}
              </div>

              <div className="space-y-4 pt-6">
                <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-4/5"></div>
              </div>

              <div className="pt-8 space-y-4">
                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:gap-3"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold tracking-tight">Back</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl mb-6 shadow-lg">
              <AlertCircle className="text-red-600 w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Error Loading Product</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={handleBack}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:gap-3"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold tracking-tight">Back</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6 shadow-lg">
              <Package className="text-slate-400 w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Product Not Found</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">The product you're looking for doesn't exist.</p>
            <button 
              onClick={handleBack}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  const images = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : [];
  
  const productName = product?.productName || product?.title || 'Product';
  const rawPrice = product?.productPrice || product?.product_price || product?.price || 0;
  const productPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice) || 0;
  const productDescription = product?.productDescription || product?.product_description || product?.description || 'No description available for this product.';
  const productRating = product?.rating || product?.averageRating || product?.average_rating || 4.5;
  const productReviews = product?.reviews || product?.reviewCount || product?.review_count || product?.numReviews || 0;
  const stockQuantity = product?.stock || product?.stockQuantity || product?.stock_quantity || 0;
  const inStock = stockQuantity > 0;
  const currentProductId = product?._id || product?.id || product?.productId || product?.product_id;

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(currentProductId) 
        ? prev.filter(id => id !== currentProductId) 
        : [...prev, currentProductId]
    );
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:gap-3 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold tracking-tight">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleFavorite}
                className="p-3 rounded-full hover:bg-slate-100 transition-all duration-300 group relative"
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    favorites.includes(currentProductId) 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'text-slate-600 group-hover:text-red-500 group-hover:scale-110'
                  }`} 
                />
              </button>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="p-3 rounded-full hover:bg-slate-100 transition-all duration-300 group"
                >
                  <Share2 className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm text-slate-700">Copy Link</button>
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm text-slate-700">Share on Twitter</button>
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm text-slate-700">Share on Facebook</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Enhanced Image Gallery Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                {images[selectedImage] && getImageUrl(images[selectedImage]) ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={getImageUrl(images[selectedImage])} 
                      alt={productName} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        imageZoom ? 'scale-150' : 'scale-100'
                      }`}
                    />
                    {/* Image Navigation Overlay */}
                    {images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                          className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                        >
                          <ChevronLeft className="w-6 h-6 text-slate-700" />
                        </button>
                        <button 
                          onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                          className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                        >
                          <ChevronRight className="w-6 h-6 text-slate-700" />
                        </button>
                      </div>
                    )}
                    {/* Zoom Button */}
                    <button 
                      onClick={() => setImageZoom(!imageZoom)}
                      className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    >
                      <ZoomIn className="w-5 h-5 text-slate-700" />
                    </button>
                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {selectedImage + 1} / {images.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-slate-400 text-xl font-medium">{productName}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => {
                  const imgUrl = getImageUrl(img);
                  return (
                    <button 
                      key={index} 
                      onClick={() => setSelectedImage(index)} 
                      className={`relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedImage === index 
                          ? 'border-blue-600 shadow-lg ring-4 ring-blue-100 scale-105' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={`${productName} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      )}
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-blue-50 rounded-xl mb-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-green-50 rounded-xl mb-2">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-purple-50 rounded-xl mb-2">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                {productName}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                {productDescription}
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 transition-all duration-300 ${
                      i < Math.floor(productRating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{productRating}</span>
                <span className="text-slate-500">({productReviews} reviews)</span>
              </div>
            </div>

            {/* Features */}
            {product?.features && Array.isArray(product.features) && product.features.length > 0 && (
              <div className="space-y-4 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-xl text-slate-900">Key Features</h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 group animate-in fade-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="mt-1 p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-slate-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            {product?.deliveryTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Fast Delivery</p>
                    <p className="text-sm text-blue-700">{product.deliveryTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Price and Actions */}
            <div className="pt-8 border-t border-slate-200 space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${productPrice.toFixed(2)}
                </span>
                {product?.featured && (
                  <span className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {stockQuantity !== undefined && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  stockQuantity < 10 
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${stockQuantity < 10 ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></div>
                  {stockQuantity < 10 ? `Only ${stockQuantity} left!` : `${stockQuantity} in stock`}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-6 py-4 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-8 py-4 font-bold text-lg text-slate-900 border-x-2 border-slate-200 min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="px-6 py-4 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 py-5 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    showSuccess
                      ? 'bg-green-600'
                      : inStock && !isAddingToCart
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-slate-400 cursor-not-allowed'
                  }`} 
                  disabled={!inStock || isAddingToCart || showSuccess}
                >
                  {showSuccess ? (
                    <>
                      <Check className="w-6 h-6" />
                      Added to Cart!
                    </>
                  ) : isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : inStock ? (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={toggleFavorite} 
                className="w-full py-5 border-2 border-slate-300 rounded-2xl font-bold hover:border-slate-400 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-slate-50 hover:shadow-lg text-lg group"
              >
                <Heart 
                  className={`w-6 h-6 transition-all duration-300 ${
                    favorites.includes(currentProductId) 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'text-slate-600 group-hover:text-red-500 group-hover:scale-110'
                  }`} 
                />
                {favorites.includes(currentProductId) ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};