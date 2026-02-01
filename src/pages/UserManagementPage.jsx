import React, { useState, useEffect } from 'react';
import UserManagementTab from '../components/UserManagmenttab';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagementPage = () => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  
  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch admin data when user role is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllUsers();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      const userData = data.user || data;
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/get-allusers`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();

      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (data.data && data.data.users && Array.isArray(data.data.users)) {
        users = data.data.users;
      } else if (data.data && Array.isArray(data.data)) {
        users = data.data;
      } else {
        console.error('Unexpected data format:', data);
      }
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Failed to load users');
      setAllUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    // Prevent multiple simultaneous updates
    if (isUpdatingRole) {
      toast.warning('Please wait for the current update to complete');
      return;
    }

    setIsUpdatingRole(true);
    const loadingToast = toast.loading('Updating user role...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/user/update-role/${userId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      await fetchAllUsers();
      
      setSelectedUserForEdit(null);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`User role updated to ${newRole} successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(`Failed to update user role: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Prevent multiple simultaneous deletions
    if (isDeletingUser) {
      toast.warning('Please wait for the current deletion to complete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsDeletingUser(true);
    const loadingToast = toast.loading('Deleting user...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/user/delete-user/${userId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      await fetchAllUsers();
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('User deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(`Failed to delete user: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeletingUser(false);
    }
  };
  
  // Show loading spinner while checking user profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized message if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <UserManagementTab
        allUsers={allUsers}
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        usersPerPage={usersPerPage}
        setUsersPerPage={setUsersPerPage}
        fetchAllUsers={fetchAllUsers}
        selectedUserForEdit={selectedUserForEdit}
        setSelectedUserForEdit={setSelectedUserForEdit}
        handleUpdateUserRole={handleUpdateUserRole}
        handleDeleteUser={handleDeleteUser}
        isLoadingUsers={isLoadingUsers}
        isUpdatingRole={isUpdatingRole}
        isDeletingUser={isDeletingUser}
      />
    </div>
  );
};

export default UserManagementPage;