import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Settings, LogOut, Package, Users, BarChart3, Shield, Menu, TrendingUp, Calendar, DollarSign } from 'lucide-react';

// Import separate components
import OrdersTab from '../components/Orderstab';
import UserManagementTab from '../components/UserManagmenttab';
import ProfileSettingsTab from '../components/Profilesettingtab';


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  
  // Password states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch admin data when user role is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats();
      fetchAllUsers();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);

      const userData = data.user || data;
      
      setUser(userData);
      setEditedUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
      alert('Failed to fetch profile. Please login again.');
    }
  };

  const fetchAdminStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/stats`, {
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Admin stats response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch admin stats: ${response.status}`);
      }

      const data = await response.json();
      console.log('Admin stats received:', data);

      setStats({
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        revenue: data.revenue || 0,
        activeProducts: data.activeProducts || 0
      });

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      console.log('Fetching all users...');
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

      console.log('All users response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw users data received:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));

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

      console.log('Processed users array:', users);
      console.log('Number of users:', users.length);

      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Updating profile with data:', editedUser);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          address: editedUser.address
        })
      });

      console.log('Update profile response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);

      const updatedUser = data.user || data;
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      console.log(`Updating user ${userId} role to ${newRole}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/user/update-role/${userId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      console.log('Update role response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      const data = await response.json();
      console.log('Role updated successfully:', data);

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
      console.log(`Deleting user ${userId}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/user/delete-user/${userId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete user response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      console.log('User deleted successfully');

      await fetchAllUsers();
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('Changing password...');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/change-password`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      console.log('Change password response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      console.log('Password changed successfully');

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
        method: 'POST',
        credentials: "include",
      });
      
      console.log('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load profile</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500 mt-1">{user?.email || ''}</p>
            {isAdmin && (
              <div className="mt-3 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ADMIN
              </div>
            )}
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-gray-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Dashboard</div>
              <div className={`text-xs ${activeTab === 'dashboard' ? 'text-gray-300' : 'text-gray-500'}`}>
                Overview & Statistics
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'orders'
                ? 'bg-gray-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{isAdmin ? 'All Orders' : 'My Orders'}</div>
              <div className={`text-xs ${activeTab === 'orders' ? 'text-gray-300' : 'text-gray-500'}`}>
                Track your orders
              </div>
            </div>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('users');
                setSidebarOpen(false);
                fetchAllUsers();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === 'users'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">User Management</div>
                <div className={`text-xs ${activeTab === 'users' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Manage all users
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('profile');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'profile'
                ? 'bg-gray-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Profile Settings</div>
              <div className={`text-xs ${activeTab === 'profile' ? 'text-gray-300' : 'text-gray-500'}`}>
                Manage your profile
              </div>
            </div>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'orders' ? 'My Orders' : 
                 activeTab === 'users' ? 'User Management' : 'Profile Settings'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium">My Account</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </button>
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded text-gray-700 font-semibold">
                {user?.name?.substring(0, 2)?.toUpperCase() || 'US'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name || 'User'}! 👋
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        {isAdmin 
                          ? 'Manage your platform, view analytics, and control user access.'
                          : 'Track your orders, manage your profile, and explore new furniture collections.'}
                      </p>
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>

                {isAdmin && stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-600 font-medium text-sm">Total Users</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-600 font-medium text-sm">Total Orders</h3>
                        <Package className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-600 font-medium text-sm">Revenue</h3>
                        <DollarSign className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">£{stats.revenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-600 font-medium text-sm">Products</h3>
                        <ShoppingBag className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
                    </div>
                  </div>
                )}

                {!isAdmin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium text-sm">Total Orders</h3>
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{user?.orders || 0}</p>
                        <span className="text-xs sm:text-sm text-gray-500">All time orders</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium text-sm">Total Spent</h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">£{(user?.totalSpent || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium text-sm">Member Since</h3>
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          {user?.memberSince ? new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                        <span className="text-xs sm:text-sm text-gray-500 mt-1">Account created</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">Common tasks and shortcuts to manage your account</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <Package className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">View Orders</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <User className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">Edit Profile</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setActiveTab('users')}
                        className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all sm:col-span-2"
                      >
                        <Users className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">Manage Users</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Using Imported Components */}
            {activeTab === 'orders' && (
              <OrdersTab 
                isAdmin={isAdmin}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'users' && isAdmin && (
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
            )}

            {activeTab === 'profile' && (
              <ProfileSettingsTab
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editedUser={editedUser}
                setEditedUser={setEditedUser}
                handleSaveProfile={handleSaveProfile}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                showPasswords={showPasswords}
                setShowPasswords={setShowPasswords}
                passwordError={passwordError}
                passwordSuccess={passwordSuccess}
                handleChangePassword={handleChangePassword}
              />
            )}
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;