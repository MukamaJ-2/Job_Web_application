import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { jobs } = useSelector((state) => state.jobs);
  const { applications } = useSelector((state) => state.applications);
  const users = useSelector((state) => state.user.users);

  const stats = {
    totalJobs: jobs?.length || 0,
    activeJobs: jobs?.filter(job => job.status === 'active').length || 0,
    totalApplications: applications?.length || 0,
    totalUsers: users?.length || 0,
    employers: users?.filter(user => user.role === 'employer').length || 0,
    jobSeekers: users?.filter(user => user.role === 'jobseeker').length || 0,
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p className="stat-number">{stats.totalJobs}</p>
          <Link to="/admin/job-postings">View All Jobs</Link>
        </div>

        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-number">{stats.activeJobs}</p>
          <Link to="/admin/job-postings?status=active">View Active Jobs</Link>
        </div>

        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{stats.totalApplications}</p>
          <Link to="/admin/applications">View Applications</Link>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <Link to="/admin/users">Manage Users</Link>
        </div>

        <div className="stat-card">
          <h3>Employers</h3>
          <p className="stat-number">{stats.employers}</p>
          <Link to="/admin/users?role=employer">View Employers</Link>
        </div>

        <div className="stat-card">
          <h3>Job Seekers</h3>
          <p className="stat-number">{stats.jobSeekers}</p>
          <Link to="/admin/users?role=jobseeker">View Job Seekers</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/users/new" className="btn-primary">
            Add New User
          </Link>
          <Link to="/admin/job-postings" className="btn-secondary">
            Review Job Postings
          </Link>
          <Link to="/admin/reports" className="btn-secondary">
            View Reports
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {/* Add recent activity list here */}
      </div>
    </div>
  );
};

export default Dashboard; 