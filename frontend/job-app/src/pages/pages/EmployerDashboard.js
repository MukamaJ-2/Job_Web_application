import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../assets/css/Dashboard.css';

const EmployerDashboard = () => {
  // Mock data for posted jobs
  const [postedJobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      applicants: 12,
      status: 'active',
      postedDate: '2024-03-15',
    },
    {
      id: 2,
      title: 'Product Manager',
      location: 'New York, NY',
      type: 'Full-time',
      applicants: 8,
      status: 'active',
      postedDate: '2024-03-14',
    },
  ]);

  // Mock data for recent applicants
  const [recentApplicants] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior Software Engineer',
      appliedDate: '2024-03-16',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Product Manager',
      appliedDate: '2024-03-15',
      status: 'reviewed',
    },
  ]);

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <Link to="/post-job" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>Active Jobs</h3>
            <p>{postedJobs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Applicants</h3>
            <p>{recentApplicants.length}</p>
          </div>
        </div>
      </div>

      {/* Posted Jobs Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Posted Jobs</h2>
          <Link to="/employer/jobs" className="view-all">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {postedJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.applicants}</td>
                  <td>
                    <span className={`status-badge ${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.postedDate}</td>
                  <td className="actions">
                    <button className="action-btn" title="View">
                      <FaEye />
                    </button>
                    <button className="action-btn" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Applicants Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Applicants</h2>
          <Link to="/employer/applicants" className="view-all">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Position</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplicants.map(applicant => (
                <tr key={applicant.id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.position}</td>
                  <td>{applicant.appliedDate}</td>
                  <td>
                    <span className={`status-badge ${applicant.status}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="action-btn" title="View Profile">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EmployerDashboard; 