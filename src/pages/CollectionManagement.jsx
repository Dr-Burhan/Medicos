import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Loader, Edit, Trash2, MoreVertical } from 'lucide-react';
import { fetchCollections, createCollection, updateCollection, deleteCollection } from '../services/collectionService';

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  // Fetch collections on mount
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCollections();
      setCollections(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load collections');
      console.error('Error loading collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
    });
    setImagePreview(null);
    setError(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Collection name is required');
      return;
    }

    if (formData.name.trim().length < 3) {
      setError('Collection name must be at least 3 characters long');
      return;
    }

    // Only require image for new collections
    if (!editingId && !formData.image) {
      setError('Collection image is required for new collections');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (editingId) {
        // Update existing collection
        const updateData = new FormData();
        updateData.append('name', formData.name.trim());
        updateData.append('description', formData.description.trim());
        if (formData.image && typeof formData.image === 'object') {
          updateData.append('image', formData.image);
        }

        const response = await updateCollection(editingId, updateData);

        if (response.success) {
          setSuccess('Collection updated successfully!');
          // Reload all collections to ensure we get the updated data with new image
          await loadCollections();
          resetForm();
          setIsModalOpen(false);

          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(response.message || response.error || 'Failed to update collection');
        }
      } else {
        // Create new collection
        const response = await createCollection(formData);

        if (response.success) {
          setSuccess('Collection created successfully!');
          setCollections(prev => [response.data, ...prev]);
          resetForm();
          setIsModalOpen(false);

          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(response.message || response.error || 'Failed to create collection');
        }
      }
    } catch (err) {
      const errorMsg = err.message || err.error || 'Failed to save collection';
      setError(errorMsg);
      console.error('Error saving collection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (collection) => {
    setEditingId(collection._id);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      image: null,
    });
    setImagePreview(collection.image?.url || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteCollection(id);

      if (response.success) {
        setSuccess('Collection deleted successfully!');
        setCollections(prev => prev.filter(col => col._id !== id));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to delete collection');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete collection');
      console.error('Error deleting collection:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-gray-200 rounded-lg h-80 animate-pulse" />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Collection Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your product collections</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          Add Collection
        </motion.button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-600 text-lg mb-4">No collections yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Your First Collection
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {collections.map((collection) => (
            <CollectionCard 
              key={collection._id} 
              collection={collection}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        error={error}
        isEditing={!!editingId}
      />
    </div>
  );
};

// Collection Card Component
const CollectionCard = ({ collection, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const formattedDate = new Date(collection.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200 overflow-hidden group">
        {collection.image?.url ? (
          <img
            src={collection.image.url}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        
        {/* Action Menu Button */}
        <div className="absolute top-2 right-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <MoreVertical size={18} className="text-gray-700" />
          </motion.button>
          
          {/* Action Menu */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-5" 
                onClick={() => setShowMenu(false)}
              ></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
              >
                <button
                  onClick={() => {
                    onEdit(collection);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition"
                >
                  <Edit size={16} className="text-blue-600" />
                  Edit Collection
                </button>
                <button
                  onClick={() => {
                    onDelete(collection._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition rounded-b-lg"
                >
                  <Trash2 size={16} />
                  Delete Collection
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {collection.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {collection.description || 'No description'}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Created: {formattedDate}</span>
          {collection.productCount > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {collection.productCount} products
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Add Collection Modal Component
const AddCollectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  onImageChange,
  imagePreview,
  isSubmitting,
  error,
  isEditing,
}) => {
  const handleRemoveImage = () => {
    // Reset image form data and preview
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal - Centered with proper positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              {/* Modal Header */}
              <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Collection' : 'Create New Collection'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={onSubmit} className="p-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Collection Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Collection Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="Enter collection name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    placeholder="Enter collection description (optional)"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Collection Image {!isEditing && <span className="text-red-500">*</span>}
                  </label>

                  {/* Image Preview */}
                  {imagePreview ? (
                    <div className="relative mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex gap-2 mt-2">
                        <motion.label
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center cursor-pointer font-medium transition"
                        >
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </motion.label>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                      <div className="flex flex-col items-center">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      {isEditing ? 'Update Collection' : 'Create Collection'}
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollectionManagement;
