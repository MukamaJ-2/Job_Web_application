import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Business,
  CalendarToday,
  AccessTime,
  CheckCircle,
  PendingActions,
  Cancel
} from '@mui/icons-material';
import { fetchUserApplications } from '../store/slices/jobSlice';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return <CheckCircle />;
    case 'rejected':
      return <Cancel />;
    case 'pending':
      return <PendingActions />;
    default:
      return null;
  }
};

const UserApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

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

  if (!applications || applications.length === 0) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          You haven't applied to any jobs yet.
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
          My Applications
        </Typography>
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid item xs={12} md={6} key={application.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {application.job.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Business />
                        {application.job.company}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                      <Chip
                        icon={getStatusIcon(application.status)}
                        label={application.status}
                        color={getStatusColor(application.status)}
                      />
                      <Chip
                        icon={<CalendarToday />}
                        label={new Date(application.appliedDate).toLocaleDateString()}
                        variant="outlined"
                      />
                    </Stack>

                    {application.lastUpdated && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <AccessTime fontSize="small" />
                        Last updated: {new Date(application.lastUpdated).toLocaleDateString()}
                      </Typography>
                    )}

                    {application.feedback && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Feedback:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {application.feedback}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default UserApplications; 