import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateJob, deleteJob } from '../../store/slices/jobSlice';
import { toast } from 'react-toastify';

const ManageJobs = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.jobs);
  const [filter, setFilter] = useState('all'); // all, active, closed, draft

  const filteredJobs = jobs?.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
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
      <div className="page-header">
        <h1>Manage Jobs</h1>
        <Link to="/employer/post-job" className="btn-primary">
          Post New Job
        </Link>
      </div>

      <div className="filters">
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
          className={filter === 'closed' ? 'active' : ''}
          onClick={() => setFilter('closed')}
        >
          Closed
        </button>
        <button
          className={filter === 'draft' ? 'active' : ''}
          onClick={() => setFilter('draft')}
        >
          Drafts
        </button>
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
                </div>
              </div>

              <div className="job-stats">
                <div className="stat">
                  <span className="label">Applications</span>
                  <span className="value">{job.applications || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Views</span>
                  <span className="value">{job.views || 0}</span>
                </div>
              </div>

              <div className="actions">
                <Link
                  to={`/employer/jobs/${job.id}/edit`}
                  className="btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() =>
                    handleStatusChange(
                      job.id,
                      job.status === 'active' ? 'closed' : 'active'
                    )
                  }
                  className="btn-secondary"
                >
                  {job.status === 'active' ? 'Close' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteJob(job.id)}
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

export default ManageJobs; 