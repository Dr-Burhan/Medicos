import React, { useState, useEffect } from 'react';
import { Package, Tag, Box, Search, Filter, RefreshCw, Eye, Edit, Trash2, MoreVertical, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

const ProductImage = ({ image, alt = "Product", size = "medium" }) => {
  let imageUrl = null;
  
  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      imageUrl = image;
    }
  } else if (image && typeof image === 'object' && image.url) {
    imageUrl = image.url;
  }
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16 sm:w-20 sm:h-20',
    large: 'w-24 h-24'
  };
  
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={alt}
        className={`${sizeClasses[size]} object-cover rounded`}
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded flex items-center justify-center`}>
      <span className="text-2xl">{'📦'}</span>
    </div>
  );
};

export default function ProductManagement() {
  const navigate = useNavigate();
  
  // ✅ USE AUTH CONTEXT
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('All Prices');
  const [sortFilter, setSortFilter] = useState('Default');
  const [stockFilter, setStockFilter] = useState('All Stock');
  const [featuredFilter, setFeaturedFilter] = useState('All Products');
  const [showActions, setShowActions] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    deliveryTime: '1 Week',
    featured: false,
    description: '',
    images: [], 
    imagePreviews: [],
    collection: ''
  });
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  // Fetch products when user is authenticated and is admin
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      console.log('✅ Admin user detected, fetching products...');
      fetchProducts();
      fetchCollections();
    }
  }, [user, authLoading]);

  // Update stats when products change
  useEffect(() => {
    fetchStats();
  }, [products]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceFilter, sortFilter, stockFilter, featuredFilter, productsPerPage]);

  // Transform backend product data to frontend format
  const transformProduct = (backendProduct) => {
    const images = backendProduct.images || [];
    
    let firstImage = null;
    if (images.length > 0) {
      const firstImg = images[0];
      if (typeof firstImg === 'string') {
        firstImage = firstImg;
      } else if (firstImg && typeof firstImg === 'object' && firstImg.url) {
        firstImage = firstImg;
      }
    }
    
    return {
      id: backendProduct._id || backendProduct.id,
      name: backendProduct.title || backendProduct.name,
      sku: backendProduct.sku,
      price: backendProduct.price,
      stock: backendProduct.stock,
      deliveryTime: backendProduct.deliveryTime,
      featured: backendProduct.featured,
      description: backendProduct.description,
      images: images,
      image: firstImage || '📦',
      collectionId: backendProduct.collectionId || backendProduct.collection,
      status: backendProduct.status || 'Active'
    };
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/get-allproducts`, {
        withCredentials: true
      });

      console.log('Products response:', response.data);

      if (response.data) {
        let productsData = [];
        
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        }

        const transformedProducts = productsData.map(transformProduct);
        setProducts(transformedProducts);
        console.log('✅ Products loaded:', transformedProducts.length);
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      toast.error('Error loading products');
    }
  };

  // Fetch all collections
  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/collections/get-collections`, {
        withCredentials: true
      });

      if (response.data) {
        let collectionsData = [];
        if (Array.isArray(response.data)) {
          collectionsData = response.data;
        } else if (response.data.collections && Array.isArray(response.data.collections)) {
          collectionsData = response.data.collections;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          collectionsData = response.data.data;
        }
        setCollections(collectionsData);
        console.log('✅ Collections loaded:', collectionsData.length);
      }
    } catch (error) {
      console.error('❌ Failed to fetch collections:', error);
      toast.error('Failed to fetch collections');
      setCollections([]);
    }
  };

  // Calculate stats from products
  const fetchStats = () => {
    const productList = Array.isArray(products) ? products : [];
    const total = productList.length;
    const outOfStock = productList.filter((product) => product.stock === 0).length;
    const lowStock = productList.filter((product) => product.stock > 0 && product.stock < 10).length;

    setStats({ total, outOfStock, lowStock });
  };

  // Handle refresh
  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await fetchProducts();
    await fetchCollections();
    console.log('Data refreshed successfully');
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = Array.from(newProduct.images);
    const currentPreviews = [...newProduct.imagePreviews];

    if (currentImages.length + files.length > 5) {
      toast.error(`You can only upload up to 5 images. Current: ${currentImages.length}, trying to add: ${files.length}`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please only upload JPEG, PNG, or WebP images');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setNewProduct({
      ...newProduct,
      images: [...currentImages, ...files],
      imagePreviews: [...currentPreviews, ...newPreviews]
    });
  };

  // Remove an image from selection
  const handleRemoveImage = (index) => {
    const newImages = [...newProduct.images];
    const newPreviews = [...newProduct.imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setNewProduct({
      ...newProduct,
      images: newImages,
      imagePreviews: newPreviews
    });
  };

  // Handle image selection for edit product
  const handleEditImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentNewImages = editProduct.newImages || [];
    const currentNewPreviews = editProduct.newImagePreviews || [];
    const allImages = (editProduct.images || []).length + currentNewImages.length;

    if (allImages + files.length > 5) {
      toast.error(`You can only upload up to 5 images total. Current: ${allImages}, trying to add: ${files.length}`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please only upload JPEG, PNG, or WebP images');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setEditProduct({
      ...editProduct,
      newImages: [...currentNewImages, ...files],
      newImagePreviews: [...currentNewPreviews, ...newPreviews]
    });
  };

  // Remove image from edit product
  const handleRemoveEditImage = (index, isExisting = false) => {
    if (isExisting) {
      const newImages = [...editProduct.images];
      newImages.splice(index, 1);
      setEditProduct({
        ...editProduct,
        images: newImages
      });
    } else {
      const newNewImages = [...editProduct.newImages];
      const newNewPreviews = [...editProduct.newImagePreviews];
      URL.revokeObjectURL(newNewPreviews[index]);
      newNewImages.splice(index, 1);
      newNewPreviews.splice(index, 1);
      setEditProduct({
        ...editProduct,
        newImages: newNewImages,
        newImagePreviews: newNewPreviews
      });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!newProduct.images || newProduct.images.length === 0) {
        toast.error('Please select at least one image');
        setIsSubmitting(false);
        return;
      }

      if (!newProduct.collection) {
        toast.error('Please select a category');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      
      formData.append('title', newProduct.name);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('stock', parseInt(newProduct.stock));
      formData.append('description', newProduct.description);
      formData.append('collectionId', newProduct.collection);
      
      if (newProduct.deliveryTime) {
        formData.append('deliveryTime', newProduct.deliveryTime);
      }
      if (newProduct.featured !== undefined) {
        formData.append('featured', newProduct.featured);
      }
      if (newProduct.sku) {
        formData.append('sku', newProduct.sku);
      }
      
      newProduct.images.forEach((image) => {
        formData.append('images', image);
      });

      console.log('=== SUBMITTING PRODUCT ===');
      
      const response = await axios.post(`${API_BASE_URL}/products/add-product`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Product added:', response.data);
      
      if (response.data.success) {
        toast.success('Product added successfully!');
        
        newProduct.imagePreviews.forEach(url => URL.revokeObjectURL(url));
        
        setNewProduct({
          name: '',
          sku: '',
          price: '',
          stock: '',
          deliveryTime: '1 Week',
          featured: false,
          description: '',
          images: [],
          imagePreviews: [],
          collection: ''
        });
        
        setShowAddProductModal(false);
        await fetchProducts();
      } else {
        toast.error(`Failed to add product: ${response.data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('❌ ADD PRODUCT ERROR:', error);
      
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        toast.error('Cannot connect to backend');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/delete-product/${productId}`, {
        withCredentials: true
      });

      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(`Error deleting product: ${error.message}`);
    }
  };

  // Handle edit product button click
  const handleEditClick = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      stock: product.stock.toString(),
      deliveryTime: product.deliveryTime,
      featured: product.featured,
      description: product.description,
      images: product.images || [],
      imagePreviews: (product.images || []).map(img => img),
      newImages: [],
      newImagePreviews: [],
      collection: product.collectionId || ''
    });
    setShowEditProductModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (!editProduct.name.trim()) {
        toast.error('Product name is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!editProduct.sku.trim()) {
        toast.error('SKU is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!editProduct.price || parseFloat(editProduct.price) <= 0) {
        toast.error('Valid price is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!editProduct.stock || parseInt(editProduct.stock) < 0) {
        toast.error('Stock quantity is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!editProduct.collection) {
        toast.error('Please select a collection');
        setIsSubmitting(false);
        return;
      }
      
      const totalImages = (editProduct.images?.length || 0) + (editProduct.newImages?.length || 0);
      if (totalImages === 0) {
        toast.error('At least one product image is required');
        setIsSubmitting(false);
        return;
      }
      
      if (editProduct.newImages && editProduct.newImages.length > 0) {
        const formData = new FormData();
        formData.append('title', editProduct.name.trim());
        formData.append('sku', editProduct.sku.trim());
        formData.append('price', parseFloat(editProduct.price).toString());
        formData.append('stock', parseInt(editProduct.stock).toString());
        formData.append('description', editProduct.description.trim());
        formData.append('deliveryTime', editProduct.deliveryTime);
        formData.append('featured', editProduct.featured === true ? 'true' : 'false');
        formData.append('collectionId', editProduct.collection.toString());
        
        const existingImages = Array.isArray(editProduct.images) ? editProduct.images : [];
        if (existingImages.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImages));
        }
        
        editProduct.newImages.forEach(image => {
          formData.append('images', image);
        });

        const response = await axios.put(
          `${API_BASE_URL}/products/update-product/${editProduct.id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        toast.success('Product updated successfully!');
        (editProduct.newImagePreviews || []).forEach(url => URL.revokeObjectURL(url));
        setShowEditProductModal(false);
        setEditProduct(null);
        await fetchProducts();
      } else {
        const productData = {
          title: editProduct.name,
          sku: editProduct.sku,
          price: parseFloat(editProduct.price),
          stock: parseInt(editProduct.stock),
          deliveryTime: editProduct.deliveryTime,
          featured: editProduct.featured,
          description: editProduct.description,
          collectionId: editProduct.collection,
          existingImages: Array.isArray(editProduct.images) ? editProduct.images : []
        };

        await axios.put(
          `${API_BASE_URL}/products/update-product/${editProduct.id}`,
          productData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        toast.success('Product updated successfully!');
        setShowEditProductModal(false);
        setEditProduct(null);
        await fetchProducts();
      }
    } catch (error) {
      console.error('Update product error:', error);
      toast.error(`Error updating product: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/products/${productId}`,
        { featured: !currentStatus },
        { withCredentials: true }
      );

      await fetchProducts();
    } catch (error) {
      console.error('Toggle featured failed:', error);
    }
  };

  // Navigate to product details page
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Filter and sort products
  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          const search = searchTerm.toLowerCase();
          const matchesSearch =
            product?.name?.toLowerCase().includes(search) ||
            product?.sku?.toLowerCase().includes(search);

          let matchesPrice = true;
          if (priceFilter === "Under $300") {
            matchesPrice = product.price < 300;
          } else if (priceFilter === "$300 - $600") {
            matchesPrice = product.price >= 300 && product.price <= 600;
          } else if (priceFilter === "$600 - $1000") {
            matchesPrice = product.price > 600 && product.price <= 1000;
          } else if (priceFilter === "Over $1000") {
            matchesPrice = product.price > 1000;
          }

          let matchesStock = true;
          if (stockFilter === "In Stock") {
            matchesStock = product.stock > 0;
          } else if (stockFilter === "Out of Stock") {
            matchesStock = product.stock === 0;
          } else if (stockFilter === "Low Stock") {
            matchesStock = product.stock > 0 && product.stock < 10;
          }

          let matchesFeatured = true;
          if (featuredFilter === "Featured Only") {
            matchesFeatured = product.featured === true;
          } else if (featuredFilter === "Not Featured") {
            matchesFeatured = product.featured === false;
          }

          return matchesSearch && matchesPrice && matchesStock && matchesFeatured;
        })
        .sort((a, b) => {
          if (sortFilter === "Name (A-Z)") {
            return a.name.localeCompare(b.name);
          } else if (sortFilter === "Name (Z-A)") {
            return b.name.localeCompare(a.name);
          } else if (sortFilter === "Price (Low to High)") {
            return a.price - b.price;
          } else if (sortFilter === "Price (High to Low)") {
            return b.price - a.price;
          } else if (sortFilter === "Stock (Low to High)") {
            return a.stock - b.stock;
          } else if (sortFilter === "Stock (High to Low)") {
            return b.stock - a.stock;
          }
          return 0;
        })
    : [];

  // Pagination calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProductsPerPageChange = (value) => {
    setProductsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Access denied for non-admin users
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            You don't have permission to access the Product Management panel. This area is restricted to administrators only.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"> 
      {/* Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-base sm:text-xl lg:text-3xl font-bold text-gray-900 hover:text-blue-600 truncate">
              Products Management
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-xs lg:text-sm font-medium text-gray-700">
              Admin Panel
            </span>
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600">TOTAL PRODUCTS</span>
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600">OUT OF STOCK</span>
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.outOfStock}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600">LOW STOCK</span>
              <Box className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">{stats.lowStock}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option>Default</option>
                  <option>Name (A-Z)</option>
                  <option>Name (Z-A)</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Stock (Low to High)</option>
                  <option>Stock (High to Low)</option>
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option>All Prices</option>
                  <option>Under $300</option>
                  <option>$300 - $600</option>
                  <option>$600 - $1000</option>
                  <option>Over $1000</option>
                </select>
                <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option>All Stock</option>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                  <option>Low Stock</option>
                </select>
                <Box className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option>All Products</option>
                  <option>Featured Only</option>
                  <option>Not Featured</option>
                </select>
                <Package className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Products</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Show:</span>
              <select
                value={productsPerPage}
                onChange={(e) => handleProductsPerPageChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-gray-600">per page</span>
            </div>
          </div>

          {/* Products Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Delivery Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Featured</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 text-sm">
                      No products found. Click refresh to load products from the backend.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xl shrink-0">
                            <ProductImage image={product.image} alt={product.name} size="small" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.status}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 font-mono">{product.sku}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">${product.price}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{product.deliveryTime}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.featured 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActions(showActions === product.id ? null : product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          {showActions === product.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowActions(null)}
                              ></div>
                              <div className={`absolute ${
                                index >= currentProducts.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'
                              } right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden`}>
                                <button 
                                  onClick={() => {
                                    handleViewDetails(product.id);
                                    setShowActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Details</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    handleEditClick(product);
                                    setShowActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Product</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    handleDelete(product.id);
                                    setShowActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-b-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete Product</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Products Cards - Mobile/Tablet */}
          <div className="lg:hidden divide-y divide-gray-200">
            {currentProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No products found. Click refresh to load products from the backend.
              </div>
            ) : (
              currentProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                      <ProductImage image={product.image} alt={product.name} size="medium" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{product.status}</p>
                        </div>
                        <button
                          onClick={() => setShowActions(showActions === product.id ? null : product.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition ml-2 shrink-0"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-3">
                        <div>
                          <span className="text-gray-500">SKU:</span>
                          <p className="font-mono text-gray-900 truncate">{product.sku}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-medium text-gray-900">${product.price}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <p className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Delivery:</span>
                          <p className="text-gray-900">{product.deliveryTime}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          product.featured 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </div>
                  </div>

                  {showActions === product.id && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black bg-opacity-25 z-40" 
                        onClick={() => setShowActions(null)}
                      ></div>
                      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 p-4">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <button 
                          onClick={() => {
                            handleViewDetails(product.id);
                            setShowActions(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                          <span>View Details</span>
                        </button>
                        <button 
                          onClick={() => {
                            handleEditClick(product);
                            setShowActions(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-lg"
                        >
                          <Edit className="w-5 h-5" />
                          <span>Edit Product</span>
                        </button>
                        <button 
                          onClick={() => {
                            handleDelete(product.id);
                            setShowActions(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete Product</span>
                        </button>
                        <button 
                          onClick={() => setShowActions(null)}
                          className="w-full px-4 py-3 mt-2 text-center text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="product-sku-123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={newProduct.deliveryTime}
                    onChange={(e) => setNewProduct({...newProduct, deliveryTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>3 Weeks</option>
                    <option>1 Month</option>
                    <option>3 Days</option>
                    <option>5 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Collection)
                  </label>
                  <select
                    value={newProduct.collection}
                    onChange={(e) => setNewProduct({...newProduct, collection: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select a Category --</option>
                    {Array.isArray(collections) && collections.length > 0 ? (
                      collections.map((collection) => (
                        <option key={collection._id} value={collection._id}>
                          {collection.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No collections available</option>
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 5)
                  </label>
                  
                  <div className="mb-3">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Click to upload images</span>
                        <span className="text-xs text-gray-500 block mt-1">PNG, JPG, WebP up to 5MB each</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {newProduct.imagePreviews && newProduct.imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {newProduct.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                    isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="product-sku-123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={editProduct.deliveryTime}
                    onChange={(e) => setEditProduct({...editProduct, deliveryTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>3 Weeks</option>
                    <option>1 Month</option>
                    <option>3 Days</option>
                    <option>5 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Collection)
                  </label>
                  <select
                    value={editProduct.collection}
                    onChange={(e) => setEditProduct({...editProduct, collection: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select a Category --</option>
                    {Array.isArray(collections) && collections.length > 0 ? (
                      collections.map((collection) => (
                        <option key={collection._id} value={collection._id}>
                          {collection.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No collections available</option>
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="space-y-4">
                    {editProduct.images && editProduct.images.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">Current Images</h4>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {editProduct.images.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {editProduct.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                                <ProductImage image={image} alt={`Product ${index + 1}`} size="medium" />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveEditImage(index, true)}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center justify-center"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded group-hover:opacity-70">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {editProduct.newImagePreviews && editProduct.newImagePreviews.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">New Images (Not Uploaded Yet)</h4>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            {editProduct.newImagePreviews.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {editProduct.newImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-300 bg-white">
                                <img
                                  src={preview}
                                  alt={`New ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveEditImage(index, false)}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center justify-center"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded group-hover:opacity-70">
                                New
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition bg-blue-50/30">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">Click to upload additional images</p>
                        <p className="text-xs text-gray-500 mt-1">Max 5 images total, 5MB each (JPEG, PNG, WebP)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleEditImageSelect}
                        className="hidden"
                        id="editProductImages"
                      />
                    </label>
                  </div>
                  
                  <div className="mt-4 bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Image Count</span>
                      <span className="text-sm font-bold text-gray-900">{(editProduct.images?.length || 0) + (editProduct.newImages?.length || 0)} / 5</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((editProduct.images?.length || 0) + (editProduct.newImages?.length || 0)) / 5 * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editProduct.featured}
                      onChange={(e) => setEditProduct({...editProduct, featured: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditProduct(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                    isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}