import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { WorkOutline, Business, Person } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const getJobSeekerLinks = () => (
    <>
      <Button color="inherit" onClick={() => navigate('/jobs')}>
        Browse Jobs
      </Button>
      <Button color="inherit" onClick={() => navigate('/my-applications')}>
        My Applications
      </Button>
      <Button color="inherit" onClick={() => navigate('/saved-jobs')}>
        Saved Jobs
      </Button>
    </>
  );

  const getEmployerLinks = () => (
    <>
      <Button color="inherit" onClick={() => navigate('/post-job')}>
        Post a Job
      </Button>
      <Button color="inherit" onClick={() => navigate('/applications')}>
        Applications
      </Button>
      <Button color="inherit" onClick={() => navigate('/my-jobs')}>
        My Jobs
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => navigate('/')}
        >
          <WorkOutline />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
          Job Portal
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {user?.role === 'jobseeker' ? getJobSeekerLinks() : getEmployerLinks()}
              <IconButton
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Person />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 