import React, { useState, useEffect } from 'react';
import UserManagementTab from '../components/UserManagmenttab';

const UserManagementPage = () => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  
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
    }
  };

  const fetchAllUsers = async () => {
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
      setAllUsers([]);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
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
      alert(`User role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(`Failed to update user role: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

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
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };
  
  if (user?.role !== 'admin') {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600 mb-4">You are not authorized to view this page.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
        />
    </div>
  );
};

export default UserManagementPage;
