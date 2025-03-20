import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, applyForJob } from '../store/slices/jobSlice';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentJob: job, loading, error } = useSelector(state => state.jobs);
  const [applicationStatus, setApplicationStatus] = useState('');

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(applyForJob(id)).unwrap();
      setApplicationStatus('success');
    } catch (err) {
      setApplicationStatus('error');
      console.error('Application failed:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {job.title}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip label={job.company} color="primary" sx={{ mr: 1 }} />
                <Chip label={job.location} sx={{ mr: 1 }} />
                <Chip label={job.type} />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography paragraph>
                {job.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Typography paragraph>
                {job.requirements}
              </Typography>

              <Box sx={{ mt: 4 }}>
                {applicationStatus === 'success' && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Application submitted successfully!
                  </Alert>
                )}
                {applicationStatus === 'error' && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to submit application. Please try again.
                  </Alert>
                )}

                {user?.role === 'job_seeker' && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleApply}
                    fullWidth
                  >
                    Apply Now
                  </Button>
                )}

                {user?.role === 'employer' && user?.id === job.employerId && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(`/employer/jobs/${id}/edit`)}
                    fullWidth
                  >
                    Edit Job
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Salary:</strong> {job.salary}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Experience:</strong> {job.experience}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Location:</strong> {job.location}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Job Type:</strong> {job.type}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetails; 