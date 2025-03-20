import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Job Portal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connecting talent with opportunities. Find your dream job or hire the perfect candidate.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link to="/jobs" style={{ color: 'inherit', textDecoration: 'none' }}>
                Browse Jobs
              </Link>
              <Link to="/companies" style={{ color: 'inherit', textDecoration: 'none' }}>
                Companies
              </Link>
              <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                About Us
              </Link>
              <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </Stack>
          </Grid>

          {/* Job Seekers */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Job Seekers
            </Typography>
            <Stack spacing={1}>
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                Create Account
              </Link>
              <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
                Upload Resume
              </Link>
              <Link to="/job-alerts" style={{ color: 'inherit', textDecoration: 'none' }}>
                Job Alerts
              </Link>
              <Link to="/career-tips" style={{ color: 'inherit', textDecoration: 'none' }}>
                Career Tips
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  123 Job Street, Employment City, 12345
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone fontSize="small" />
                <Typography variant="body2">+1 234 567 8900</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email fontSize="small" />
                <Typography variant="body2">contact@jobportal.com</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            © {currentYear} Job Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 