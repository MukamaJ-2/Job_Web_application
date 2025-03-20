import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateJob, deleteJob } from '../../store/slices/jobSlice';
import { toast } from 'react-toastify';

const ManageJobPostings = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.jobs);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs?.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      dispatch(updateJob({ id: jobId, status: newStatus }));
      toast.success('Job status updated successfully');
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        dispatch(deleteJob(jobId));
        toast.success('Job deleted successfully');
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  return (
    <div className="manage-jobs-container">
      <h1>Manage Job Postings</h1>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'closed' ? 'active' : ''}
            onClick={() => setFilter('closed')}
          >
            Closed
          </button>
          <button
            className={filter === 'flagged' ? 'active' : ''}
            onClick={() => setFilter('flagged')}
          >
            Flagged
          </button>
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs found</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
                <p className="location">{job.location}</p>
                <div className="tags">
                  <span className={`status ${job.status}`}>{job.status}</span>
                  <span className="type">{job.type}</span>
                  <span className="salary">
                    ${job.salary.min.toLocaleString()} - $
                    {job.salary.max.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="job-stats">
                <div className="stat">
                  <span className="label">Posted By</span>
                  <span className="value">{job.employer.name}</span>
                </div>
                <div className="stat">
                  <span className="label">Posted Date</span>
                  <span className="value">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Applications</span>
                  <span className="value">{job.applications || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Views</span>
                  <span className="value">{job.views || 0}</span>
                </div>
              </div>

              <div className="job-actions">
                <div className="status-control">
                  <label>Status:</label>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className={`status-${job.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                    className="btn-secondary"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageJobPostings; 