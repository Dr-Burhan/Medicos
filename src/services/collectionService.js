import axios from 'axios';

const API_BASE_URL =  'http://localhost:8000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Fetch all collections
 */
export const fetchCollections = async () => {
  try {
    const response = await API.get('/collections/get-collections');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch collections' };
  }
};

/**
 * Create a new collection with image upload
 * @param {Object} collectionData - { name, description, image (File) }
 */
export const createCollection = async (collectionData) => {
  try {
    const formData = new FormData();
    formData.append('name', collectionData.name);
    formData.append('description', collectionData.description || '');
    formData.append('image', collectionData.image);

    const response = await API.post('/collections/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create collection' };
  }
};

/**
 * Get a single collection by ID
 */
export const getCollectionById = async (id) => {
  try {
    const response = await API.get(`/collections/get-collection/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch collection' };
  }
};

/**
 * Get products by collection ID
 */
export const getProductsByCollection = async (id, page = 1, limit = 12) => {
  try {
    const response = await API.get(`/collections/${id}/products`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

/**
 * Update a collection
 */
export const updateCollection = async (id, collectionData) => {
  try {
    const response = await API.put(
      `/collections/update-collection/${id}`,
      collectionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update collection' };
  }
};

/**
 * Delete a collection
 */
export const deleteCollection = async (id) => {
  try {
    const response = await API.delete(`/collections/delete-collection/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete collection' };
  }
};

export default API;
