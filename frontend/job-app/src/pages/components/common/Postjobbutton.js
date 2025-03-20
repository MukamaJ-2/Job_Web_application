import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

const PostJobButton = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handlePostJobClick = () => {
    if (!user) {
      // If not logged in, redirect to employer login with return URL
      navigate('/login', { 
        state: { 
          returnUrl: '/employer/dashboard',
          role: 'employer',
          message: 'Please login as an employer to post a job'
        }
      });
    } else if (user.role !== 'employer') {
      // If logged in but not as employer, show error message
      navigate('/login', {
        state: {
          returnUrl: '/employer/dashboard',
          role: 'employer',
          message: 'You need an employer account to post jobs'
        }
      });
    } else {
      // If logged in as employer, go to dashboard
      navigate('/employer/dashboard');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePostJobClick}
      size="large"
    >
      Post a Job
    </Button>
  );
};

export default PostJobButton; 