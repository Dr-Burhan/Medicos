 import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import axios from 'axios';

// Helper function to extract image URL from collection
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  if (typeof imageData === 'string') return imageData;
  if (typeof imageData === 'object' && imageData.url) return imageData.url;
  return null;
};

const API = {
  getCollections: async () => {
    try {
      const response = await axios.get( "http://localhost:8000/api/collections/get-collections" );
      return { success: response.data.success, data: response.data.data || [] };
    } catch (error) {
      console.error('Error fetching collections:', error);
      return { success: false, error: error.message };
    }
  }
};

export const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await API.getCollections();
      if (response.success) setCollections(response.data);
      else setError('Failed to load collections');
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop by Collection</h1>
          <p className="text-xl text-gray-600">Explore our curated collections</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection._id} onClick={() => (collection)} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-64 bg-linear-to-br from-blue-100 to-purple-100 overflow-hidden">
                  {collection.image && getImageUrl(collection.image) ? (
                    <img src={getImageUrl(collection.image)} alt={collection.name || 'Collection'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-blue-200 to-purple-200 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white opacity-50">{collection.name ? collection.name.charAt(0) : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{collection.name || 'Untitled Collection'}</h3>
                  <p className="text-gray-600 mb-4">{collection.description || 'No description available'}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                    <Link to={`/collections/${collection._id}/products`}    >Explore Collection</Link>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
