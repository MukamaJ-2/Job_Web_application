import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { fetchEmployerJobs, deleteJob } from '../../store/slices/jobSlice';

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employer-tabpanel-${index}`}
      aria-labelledby={`employer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [messageDialog, setMessageDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [message, setMessage] = useState('');
  const [viewApplicantDialog, setViewApplicantDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { jobs, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployerJobs(user.id));
  }, [dispatch, user.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddJob = () => {
    navigate('/jobs/create');
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await dispatch(deleteJob(jobId));
    }
  };

  const handleMessageApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setMessageDialog(true);
  };

  const handleSendMessage = () => {
    // Implement send message functionality
    console.log('Message sent to:', selectedApplicant, message);
    setMessageDialog(false);
    setMessage('');
  };

  const handleViewApplicant = (applicant, job) => {
    setSelectedApplicant(applicant);
    setSelectedJob(job);
    setViewApplicantDialog(true);
  };

  const handleUpdateStatus = (applicantId, status) => {
    // Implement status update functionality
    console.log('Status updated for:', applicantId, status);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Dashboard Header */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs>
          <Typography variant="h4" component="h1" gutterBottom>
            Employer Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddJob}
          >
            Post New Job
          </Button>
        </Grid>
      </Grid>

      {/* Dashboard Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="employer dashboard tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Posted Jobs" />
          <Tab label="Applications" />
          <Tab label="Messages" />
        </Tabs>

        {/* Posted Jobs Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{job.applications?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={job.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditJob(job.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteJob(job.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Applications Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.flatMap((job) =>
                  (job.applications || []).map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar alt={application.applicant.name}>
                            {application.applicant.name.charAt(0)}
                          </Avatar>
                          <Typography>{application.applicant.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          color={
                            application.status === 'approved'
                              ? 'success'
                              : application.status === 'rejected'
                              ? 'error'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewApplicant(application, job)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            onClick={() =>
                              handleUpdateStatus(application.id, 'approved')
                            }
                            color="success"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() =>
                              handleUpdateStatus(application.id, 'rejected')
                            }
                            color="error"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Message">
                          <IconButton
                            onClick={() => handleMessageApplicant(application)}
                          >
                            <MessageIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Messages Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" color="text.secondary" align="center">
            Coming soon: Messaging functionality
          </Typography>
        </TabPanel>
      </Paper>

      {/* Message Dialog */}
      <Dialog
        open={messageDialog}
        onClose={() => setMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {selectedApplicant?.applicant?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog(false)}>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Applicant Dialog */}
      <Dialog
        open={viewApplicantDialog}
        onClose={() => setViewApplicantDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplicant && selectedJob && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Applicant Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography>{selectedApplicant.applicant.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography>{selectedApplicant.applicant.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography>{selectedApplicant.applicant.phone}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Application Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Job Title
                    </Typography>
                    <Typography>{selectedJob.title}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Applied Date
                    </Typography>
                    <Typography>
                      {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedApplicant.status}
                      color={
                        selectedApplicant.status === 'approved'
                          ? 'success'
                          : selectedApplicant.status === 'rejected'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Cover Letter
                </Typography>
                <Typography>{selectedApplicant.coverLetter}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewApplicantDialog(false)}>Close</Button>
          <Button
            onClick={() => handleMessageApplicant(selectedApplicant)}
            startIcon={<MessageIcon />}
            variant="contained"
          >
            Message Applicant
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployerDashboard; 