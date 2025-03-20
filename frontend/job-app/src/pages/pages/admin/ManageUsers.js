import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserStatus, deleteUser } from '../../store/slices/userSlice';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [filter, setFilter] = useState('all'); // all, employer, jobseeker
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await dispatch(updateUserStatus({ userId, status: newStatus })).unwrap();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="manage-users-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <Link to="/admin/users/new" className="btn-primary">
          Add New User
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button
            className={filter === 'employer' ? 'active' : ''}
            onClick={() => setFilter('employer')}
          >
            Employers
          </button>
          <button
            className={filter === 'jobseeker' ? 'active' : ''}
            onClick={() => setFilter('jobseeker')}
          >
            Job Seekers
          </button>
        </div>
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={`${user.firstName}'s avatar`} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                </div>

                <div className="user-details">
                  <h3>{`${user.firstName} ${user.lastName}`}</h3>
                  <p className="email">{user.email}</p>
                  <p className="role">{user.role}</p>
                  <p className="joined-date">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="user-stats">
                {user.role === 'employer' ? (
                  <>
                    <div className="stat">
                      <span className="label">Posted Jobs</span>
                      <span className="value">{user.jobsPosted || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Active Jobs</span>
                      <span className="value">{user.activeJobs || 0}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat">
                      <span className="label">Applications</span>
                      <span className="value">{user.applications || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Saved Jobs</span>
                      <span className="value">{user.savedJobs || 0}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="user-status">
                <select
                  value={user.status}
                  onChange={(e) => handleUpdateUserStatus(user.id, e.target.value)}
                  className={`status-${user.status}`}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="actions">
                <Link
                  to={`/admin/users/${user.id}/edit`}
                  className="btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsers; 