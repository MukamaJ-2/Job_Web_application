import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { fetchApplications, updateApplicationStatus } from '../redux/slices/applicationsSlice';

const Applications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, loading, error } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = (application) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
    setStatusUpdate('');
  };

  const handleSubmitStatusUpdate = async () => {
    try {
      await dispatch(
        updateApplicationStatus({
          applicationId: selectedApplication._id,
          status: statusUpdate,
        })
      ).unwrap();
      handleCloseDialog();
    } catch (err) {
      // Error is handled by the Redux slice
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'info';
      case 'shortlisted':
        return 'primary';
      case 'rejected':
        return 'error';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredApplications = applications.filter((application) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return application.status === 'pending';
    if (tabValue === 2) return application.status === 'reviewed';
    if (tabValue === 3) return application.status === 'shortlisted';
    if (tabValue === 4) return application.status === 'rejected';
    if (tabValue === 5) return application.status === 'accepted';
    return true;
  });

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Applications
        </Typography>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Reviewed" />
            <Tab label="Shortlisted" />
            <Tab label="Rejected" />
            <Tab label="Accepted" />
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {filteredApplications.map((application) => (
            <Grid item xs={12} key={application._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {application.job.title}
                    </Typography>
                    <Chip
                      label={application.status}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    {application.job.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {application.coverLetter.substring(0, 200)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/jobs/${application.job._id}`)}
                  >
                    View Job
                  </Button>
                  {user?.role === 'employer' && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleStatusUpdate(application)}
                    >
                      Update Status
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmitStatusUpdate} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Applications; 
