import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeSavedJob } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((state) => state.user);
  const { jobs } = useSelector((state) => state.jobs);

  const handleRemoveJob = (jobId) => {
    try {
      dispatch(removeSavedJob(jobId));
      toast.success('Job removed from saved jobs');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  return (
    <div className="saved-jobs-container">
      <h1>Saved Jobs</h1>

      <div className="jobs-list">
        {savedJobs?.length === 0 ? (
          <div className="no-jobs">
            <p>No saved jobs found</p>
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          savedJobs?.map((savedJob) => {
            const job = jobs?.find((j) => j.id === savedJob.jobId);
            if (!job) return null;

            return (
              <div key={job.id} className="job-card">
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p className="location">{job.location}</p>
                  <div className="tags">
                    <span className="type">{job.type}</span>
                    <span className="experience">{job.experienceLevel}</span>
                    <span className="salary">
                      ${job.salary.min.toLocaleString()} - $
                      {job.salary.max.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="saved-date">
                  Saved on:{' '}
                  {new Date(savedJob.savedDate).toLocaleDateString()}
                </div>

                <div className="job-description">
                  <p>{job.description.substring(0, 200)}...</p>
                </div>

                <div className="actions">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn-primary"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className="btn-secondary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedJobs; 