import React from 'react';
import { Users, RefreshCw, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const UserManagementTab = ({
  allUsers = [],
  user,
  currentPage,
  setCurrentPage,
  usersPerPage,
  setUsersPerPage,
  fetchAllUsers,
  selectedUserForEdit,
  setSelectedUserForEdit,
  handleUpdateUserRole,
  handleDeleteUser,
  isLoadingUsers,
  isUpdatingRole,
  isDeletingUser
}) => {
  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(allUsers.length / usersPerPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage user roles and permissions</p>
        </div>
        <button
          onClick={fetchAllUsers}
          disabled={isLoadingUsers}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
          {isLoadingUsers ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Total users loaded: {allUsers.length}
        </p>
        {allUsers.length === 0 && !isLoadingUsers && (
          <p className="text-sm text-blue-600 mt-2">
            No users found. Check browser console for API response details.
          </p>
        )}
      </div>

      {/* Users per page selector */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            disabled={isLoadingUsers}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value={5}>5 users</option>
            <option value={10}>10 users</option>
            <option value={25}>25 users</option>
            <option value={50}>50 users</option>
            <option value={100}>100 users</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-semibold text-gray-900">{allUsers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600 text-lg">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{u.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{u.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">{u.email || 'N/A'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUserForEdit(u)}
                          disabled={u._id === user._id || u.id === user.id || isUpdatingRole || isDeletingUser}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        {(u._id !== user._id && u.id !== user.id) && (
                          <button
                            onClick={() => handleDeleteUser(u._id || u.id)}
                            disabled={isUpdatingRole || isDeletingUser}
                            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs sm:text-sm"
                          >
                            {isDeletingUser ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="font-medium">No users found</p>
                      <p className="text-sm mt-1">Try refreshing the page or check the API connection</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoadingUsers && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, allUsers.length)} of {allUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update User Role</h3>
            <p className="text-gray-600 mb-6">
              Change role for <strong>{selectedUserForEdit.name}</strong>
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleUpdateUserRole(selectedUserForEdit._id || selectedUserForEdit.id, 'user')}
                disabled={isUpdatingRole}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedUserForEdit.role === 'user'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold">User</div>
                    <div className="text-sm text-gray-500">Standard user access</div>
                  </div>
                  {selectedUserForEdit.role === 'user' && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleUpdateUserRole(selectedUserForEdit._id || selectedUserForEdit.id, 'admin')}
                disabled={isUpdatingRole}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedUserForEdit.role === 'admin'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      Admin
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-gray-500">Full platform access</div>
                  </div>
                  {selectedUserForEdit.role === 'admin' && (
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {isUpdatingRole && (
              <div className="mb-4 flex items-center justify-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Updating role...</span>
              </div>
            )}

            <button
              onClick={() => setSelectedUserForEdit(null)}
              disabled={isUpdatingRole}
              className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;