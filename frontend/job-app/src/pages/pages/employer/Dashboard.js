import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { jobs } = useSelector((state) => state.jobs);
  const { applications } = useSelector((state) => state.applications);

  const stats = {
    activeJobs: jobs?.filter(job => job.status === 'active').length || 0,
    totalApplications: applications?.length || 0,
    newApplications: applications?.filter(app => app.status === 'new').length || 0,
    shortlisted: applications?.filter(app => app.status === 'shortlisted').length || 0,
  };

  return (
    <div className="dashboard-container">
      <h1>Employer Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-number">{stats.activeJobs}</p>
          <Link to="/employer/manage-jobs">View All Jobs</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{stats.totalApplications}</p>
          <Link to="/employer/applications">View All Applications</Link>
        </div>
        
        <div className="stat-card">
          <h3>New Applications</h3>
          <p className="stat-number">{stats.newApplications}</p>
          <Link to="/employer/applications?status=new">View New</Link>
        </div>
        
        <div className="stat-card">
          <h3>Shortlisted</h3>
          <p className="stat-number">{stats.shortlisted}</p>
          <Link to="/employer/applications?status=shortlisted">View Shortlisted</Link>
        </div>
      </div>

      <div className="action-buttons">
        <Link to="/employer/post-job" className="btn-primary">
          Post New Job
        </Link>
        <Link to="/employer/manage-jobs" className="btn-secondary">
          Manage Jobs
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 