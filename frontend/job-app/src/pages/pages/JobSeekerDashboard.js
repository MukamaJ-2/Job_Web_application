import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaBookmark, FaUser, FaBell } from 'react-icons/fa';
import '../assets/css/Dashboard.css';

const JobSeekerDashboard = () => {
  // Mock data for job applications
  const [applications] = useState([
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      appliedDate: '2024-03-15',
      status: 'pending',
    },
    {
      id: 2,
      jobTitle: 'Frontend Developer',
      company: 'Web Solutions Inc',
      appliedDate: '2024-03-14',
      status: 'reviewed',
    },
  ]);

  // Mock data for saved jobs
  const [savedJobs] = useState([
    {
      id: 1,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      salary: '$80k - $100k',
      savedDate: '2024-03-16',
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$90k - $120k',
      savedDate: '2024-03-15',
    },
  ]);

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Job Seeker Dashboard</h1>
        <Link to="/profile" className="btn btn-primary">
          Update Profile
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>Applications</h3>
            <p>{applications.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBookmark />
          </div>
          <div className="stat-info">
            <h3>Saved Jobs</h3>
            <p>{savedJobs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBell />
          </div>
          <div className="stat-info">
            <h3>Job Alerts</h3>
            <p>3</p>
          </div>
        </div>
      </div>

      {/* Job Applications Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Applications</h2>
          <Link to="/applications" className="view-all">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id}>
                  <td>{application.jobTitle}</td>
                  <td>{application.company}</td>
                  <td>{application.appliedDate}</td>
                  <td>
                    <span className={`status-badge ${application.status}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="action-btn" title="View Details">
                      <FaUser />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Saved Jobs Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Saved Jobs</h2>
          <Link to="/saved-jobs" className="view-all">
            View All
          </Link>
        </div>
        <div className="saved-jobs-grid">
          {savedJobs.map(job => (
            <div key={job.id} className="saved-job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p className="location">{job.location}</p>
              <p className="salary">{job.salary}</p>
              <div className="card-footer">
                <span className="saved-date">Saved on {job.savedDate}</span>
                <Link to={`/jobs/${job.id}`} className="btn btn-secondary">
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobSeekerDashboard; 