import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJobs as fetchUserJobs, fetchApplications as fetchUserApplications } from '../store/slices/jobSlice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Work,
  Business,
  LocationOn,
  AccessTime,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs: userJobs, applications: userApplications, loading, error } = useSelector((state) => state.jobs);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (user?.role === 'employer') {
      dispatch(fetchUserJobs());
    } else {
      dispatch(fetchUserApplications());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.role === 'employer' ? 'Manage your job postings' : 'Track your job applications'}
        </Typography>
      </Box>

      {user?.role === 'employer' ? (
        // Employer Dashboard
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              component={Link}
              to="/jobs/create"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Post New Job
            </Button>
          </Box>

          <Grid container spacing={3}>
            {userJobs.map((job) => (
              <Grid item xs={12} md={6} key={job._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<Business />}
                        label={job.company}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<LocationOn />}
                        label={job.location}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<Work />}
                        label={job.type}
                        size="small"
                        color={job.type === 'full-time' ? 'success' : 'info'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <AccessTime sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {job.applications?.length || 0} applications received
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/jobs/${job._id}`}
                      size="small"
                    >
                      View Details
                    </Button>
                    <Button
                      component={Link}
                      to={`/jobs/${job._id}/edit`}
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {userJobs.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    You haven't posted any jobs yet.
                  </Typography>
                  <Button
                    component={Link}
                    to="/jobs/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Post Your First Job
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        // Job Seeker Dashboard
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Active Applications" />
            <Tab label="Archived Applications" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 ? (
              <List>
                {userApplications
                  .filter(app => app.status !== 'archived')
                  .map((application) => (
                    <React.Fragment key={application._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Typography variant="h6" component="div">
                              {application.job.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                <Business sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                                {application.job.company}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <LocationOn sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                                {application.job.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <AccessTime sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Chip
                            label={application.status}
                            color={
                              application.status === 'accepted' ? 'success' :
                              application.status === 'rejected' ? 'error' :
                              'default'
                            }
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Button
                            component={Link}
                            to={`/jobs/${application.job._id}`}
                            size="small"
                          >
                            View Job
                          </Button>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}

                {userApplications.filter(app => app.status !== 'archived').length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No active applications found.
                    </Typography>
                    <Button
                      component={Link}
                      to="/"
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Browse Jobs
                    </Button>
                  </Box>
                )}
              </List>
            ) : (
              <List>
                {userApplications
                  .filter(app => app.status === 'archived')
                  .map((application) => (
                    <React.Fragment key={application._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={application.job.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {application.job.company}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Button
                          component={Link}
                          to={`/jobs/${application.job._id}`}
                          size="small"
                        >
                          View Job
                        </Button>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}

                {userApplications.filter(app => app.status === 'archived').length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No archived applications found.
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard; 