import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  InputAdornment,
  Tooltip,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  fetchAllUsers,
  fetchAdminStats,
  fetchAllJobPostings,
  fetchAllApplications,
  updateUserStatus,
  updateUserInfo,
  updateJobStatus,
  updateApplicationStatus,
  deleteJobPosting
} from '../../store/slices/adminSlice';

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    users,
    stats,
    jobPostings,
    applications,
    loading,
    error
  } = useSelector((state) => state.admin);

  const [tabValue, setTabValue] = useState(0);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsers());
    dispatch(fetchAllJobPostings());
    dispatch(fetchAllApplications());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUserData(user);
    setEditUserDialog(true);
  };

  const handleUpdateUserStatus = (userId, status) => {
    dispatch(updateUserStatus({ userId, status }));
  };

  const handleSaveUserEdit = () => {
    dispatch(updateUserInfo({
      userId: selectedUser.id,
      userData: editedUserData
    }));
    setEditUserDialog(false);
  };

  const handleRefreshData = () => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsers());
    dispatch(fetchAllJobPostings());
    dispatch(fetchAllApplications());
  };

  const handleJobMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleJobMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleUpdateJobStatus = (status) => {
    if (selectedJob) {
      dispatch(updateJobStatus({ jobId: selectedJob.id, status }));
    }
    handleJobMenuClose();
  };

  const handleDeleteJob = () => {
    if (selectedJob) {
      dispatch(deleteJobPosting(selectedJob.id));
    }
    setDeleteConfirmDialog(false);
    handleJobMenuClose();
  };

  const handleUpdateAppStatus = (applicationId, status) => {
    dispatch(updateApplicationStatus({ applicationId, status }));
  };

  // Filter functions
  const filteredUsers = [...users.jobSeekers, ...users.employers].filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Dashboard Overview Section
  const renderDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Total Users
          </Typography>
          <Typography variant="h4" component="div">
            {stats.totalUsers}
          </Typography>
          <Typography color="textSecondary">
            Active: {stats.activeUsers}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Total Jobs
          </Typography>
          <Typography variant="h4" component="div">
            {stats.totalJobs}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Total Applications
          </Typography>
          <Typography variant="h4" component="div">
            {stats.totalApplications}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Active Jobs
          </Typography>
          <Typography variant="h4" component="div">
            {jobPostings.filter(job => job.status === 'active').length}
          </Typography>
          <Typography color="textSecondary">
            Total: {jobPostings.length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentActivity?.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );

  // Users Management Section
  const renderUsers = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="employer">Employers</MenuItem>
                <MenuItem value="job_seeker">Job Seekers</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefreshData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'employer' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleUpdateUserStatus(
                          user.id,
                          user.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  // Jobs Management Section
  const renderJobs = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Posted By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <Badge badgeContent={jobPostings.reduce((acc, job) => acc + (job.applications?.length || 0), 0)} color="primary">
                      Applications
                    </Badge>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.employer.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={job.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{job.applications?.length || 0}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleJobMenuClick(e, job)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Job Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleJobMenuClose}
      >
        <MenuItem onClick={() => handleUpdateJobStatus('active')}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Mark Active
        </MenuItem>
        <MenuItem onClick={() => handleUpdateJobStatus('inactive')}>
          <BlockIcon sx={{ mr: 1 }} /> Mark Inactive
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setDeleteConfirmDialog(true)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Job
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this job posting? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteJob} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );

  // Applications Management Section
  const renderApplications = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.applicant.name}</TableCell>
                    <TableCell>{application.job.title}</TableCell>
                    <TableCell>{application.job.company}</TableCell>
                    <TableCell>
                      <Chip
                        label={application.status}
                        color={
                          application.status === 'accepted' ? 'success' :
                          application.status === 'rejected' ? 'error' :
                          'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleUpdateAppStatus(application.id, 'accepted')}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleUpdateAppStatus(application.id, 'rejected')}
                        color="error"
                      >
                        <BlockIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab icon={<DashboardIcon />} label="Overview" />
                <Tab icon={<PersonIcon />} label="Users" />
                <Tab icon={<WorkIcon />} label="Jobs" />
                <Tab icon={<DescriptionIcon />} label="Applications" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderDashboard()}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderUsers()}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderJobs()}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {renderApplications()}
            </TabPanel>
          </>
        )}

        {/* Edit User Dialog */}
        <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)}>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={editedUserData.name || ''}
              onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={editedUserData.email || ''}
              onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
            />
            {editedUserData.role === 'employer' && (
              <TextField
                margin="dense"
                label="Company"
                fullWidth
                value={editedUserData.company || ''}
                onChange={(e) => setEditedUserData({ ...editedUserData, company: e.target.value })}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveUserEdit} color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 