import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { submitApplication } from '../../store/actions/applicationActions';
import { createNotification } from '../../store/actions/notificationActions';
import FileUpload from './FileUpload';

const ApplyJobButton = ({ jobId, jobTitle, employerId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleApplyClick = () => {
    if (!user) {
      // If not logged in, redirect to job seeker login
      navigate('/login', {
        state: {
          returnUrl: `/jobs/${jobId}`,
          role: 'jobseeker',
          message: 'Please login as a job seeker to apply'
        }
      });
    } else if (user.role !== 'jobseeker') {
      navigate('/login', {
        state: {
          returnUrl: `/jobs/${jobId}`,
          role: 'jobseeker',
          message: 'You need a job seeker account to apply'
        }
      });
    } else {
      setOpen(true);
    }
  };

  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    try {
      // Submit application with CV
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('jobId', jobId);
      
      const application = await dispatch(submitApplication(formData));
      
      // Create notification for employer
      await dispatch(createNotification({
        userId: employerId,
        type: 'application',
        title: 'New Job Application',
        message: `A new application has been received for ${jobTitle}`,
        data: { applicationId: application.id }
      }));

      // Show success notification to job seeker
      setOpen(false);
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyClick}
        size="large"
      >
        Apply Now
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload Your CV</DialogTitle>
        <DialogContent>
          <FileUpload
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!file}
            variant="contained" 
            color="primary"
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplyJobButton; 