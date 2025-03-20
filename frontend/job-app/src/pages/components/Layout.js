import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Dashboard,
  Work,
  ExitToApp,
  Add as AddIcon,
  AccountCircle,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { Link as RouterLink } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleCloseUserMenu();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleDashboardClick = () => {
    handleCloseUserMenu();
    if (user?.role === 'employer') {
      navigate('/employer');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => handleNavigate('/')}
            >
              Job Portal
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={() => handleNavigate('/jobs')}>
                  <Typography textAlign="center">Jobs</Typography>
                </MenuItem>
                {isAuthenticated && user?.role === 'employer' && (
                  <MenuItem onClick={() => handleNavigate('/jobs/create')}>
                    <Typography textAlign="center">Post Job</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => handleNavigate('/')}
            >
              Job Portal
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => handleNavigate('/jobs')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Jobs
              </Button>
              {isAuthenticated && user?.role === 'employer' && (
                <Button
                  onClick={() => handleNavigate('/jobs/create')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={<AddIcon />}
                >
                  Post Job
                </Button>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user?.name} src={user?.avatar}>
                        {user?.name?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleDashboardClick}>
                      <Dashboard sx={{ mr: 1 }} fontSize="small" />
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem component={RouterLink} to="/admin" onClick={handleCloseUserMenu}>
                        <AdminIcon sx={{ mr: 1 }} fontSize="small" />
                        <Typography textAlign="center">Admin Panel</Typography>
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 1 }} fontSize="small" />
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => handleNavigate('/login')}
                    sx={{ color: 'white' }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/register')}
                    variant="contained"
                    color="secondary"
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 