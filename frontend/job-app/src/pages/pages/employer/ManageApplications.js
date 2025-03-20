import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  fetchApplications,
  updateApplicationStatusById 
} from '../../store/actions/applicationActions';
import { createNotification } from '../../store/actions/notificationActions';
import { formatDate, formatRelativeTime } from '../../utils/helpers';

const ManageApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector(state => state.applications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const updatedApplication = await dispatch(
        updateApplicationStatusById(applicationId, newStatus)
      );

      // If application is approved, send notification to job seeker
      if (newStatus === 'approved') {
        await dispatch(createNotification({
          userId: updatedApplication.userId,
          type: 'application_status',
          title: 'Application Approved',
          message: `Congratulations! Your application for ${updatedApplication.job.title} has been approved.`,
          data: {
            applicationId: updatedApplication.id,
            jobId: updatedApplication.job.id
          }
        }));
      }

      setOpenDialog(false);
    } catch (error) {
      alert('Failed to update application status');
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  if (loading) {
    return <Typography>Loading applications...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Manage Applications
        </Typography>

        <Grid container spacing={3}>
          {applications.map(application => (
            <Grid item xs={12} key={application.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6">
                        {application.user.name}
                      </Typography>
                      <Typography color="textSecondary">
                        {application.user.email}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography>
                        Applied for: {application.job.title}
                      </Typography>
                      <Typography color="textSecondary">
                        {formatRelativeTime(application.createdAt)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Chip
                        label={application.status}
                        color={
                          application.status === 'approved' ? 'success' :
                          application.status === 'rejected' ? 'error' :
                          'default'
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewApplication(application)}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          {selectedApplication && (
            <>
              <DialogTitle>
                Application Details
              </DialogTitle>
              
              <DialogContent>
                <Box mb={3}>
                  <Typography variant="h6">Applicant Information</Typography>
                  <Typography>Name: {selectedApplication.user.name}</Typography>
                  <Typography>Email: {selectedApplication.user.email}</Typography>
                  <Typography>Applied: {formatDate(selectedApplication.createdAt)}</Typography>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Job Information</Typography>
                  <Typography>Position: {selectedApplication.job.title}</Typography>
                  <Typography>Company: {selectedApplication.job.company}</Typography>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Resume</Typography>
                  <Button
                    variant="outlined"
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                  >
                    View Resume
                  </Button>
                </Box>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>
                  Close
                </Button>
                {selectedApplication.status !== 'approved' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                    color="primary"
                    variant="contained"
                  >
                    Approve Application
                  </Button>
                )}
                {selectedApplication.status !== 'rejected' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    color="error"
                    variant="contained"
                  >
                    Reject Application
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageApplications; 