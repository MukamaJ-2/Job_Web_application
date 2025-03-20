import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  Container,
  ButtonGroup
} from '@mui/material';
import {
  LocationOn,
  Business,
  WorkOutline,
  AttachMoney,
  Timer
} from '@mui/icons-material';
import { fetchJobs } from '../store/slices/jobSlice';
import JobApplication from './JobApplication';

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [applicationDialog, setApplicationDialog] = useState({
    open: false,
    jobId: null,
    jobTitle: ''
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApply = (jobId, jobTitle) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplicationDialog({
      open: true,
      jobId,
      jobTitle
    });
  };

  const handleCloseDialog = () => {
    setApplicationDialog({
      open: false,
      jobId: null,
      jobTitle: ''
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No jobs available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Available Jobs ({jobs.length})
        </Typography>
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {job.logo}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Business sx={{ fontSize: 18, mr: 0.5 }} />
                        {job.company}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                      {job.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <AttachMoney sx={{ fontSize: 18, mr: 0.5 }} />
                      {job.salary}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Timer sx={{ fontSize: 18, mr: 0.5 }} />
                      {job.postedDate}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description}
                  </Typography>

                  <Chip
                    icon={<WorkOutline />}
                    label={job.type}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <ButtonGroup fullWidth>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(job.id)}
                    >
                      View Details
                    </Button>
                    {user?.role === 'job_seeker' && (
                      <Button
                        variant="contained"
                        onClick={() => handleApply(job.id, job.title)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </ButtonGroup>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <JobApplication
        open={applicationDialog.open}
        handleClose={handleCloseDialog}
        jobId={applicationDialog.jobId}
        jobTitle={applicationDialog.jobTitle}
      />
    </Container>
  );
};

export default JobList; 