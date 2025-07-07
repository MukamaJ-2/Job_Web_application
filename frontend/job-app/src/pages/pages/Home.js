import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { fetchJobs } from '../redux/slices/jobSlice';
import { FaBriefcase, FaBuilding, FaUsers } from 'react-icons/fa';
import '../assets/css/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    location: '',
    type: '',
    category: ''
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.type) searchParams.set('type', filters.type);
    if (filters.category) searchParams.set('category', filters.category);
    navigate(`/jobs?${searchParams.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const featuredJobs = jobs?.slice(0, 6) || [];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Find Your Dream Job
          </Typography>
          <Typography variant="h5" gutterBottom>
            Browse thousands of job opportunities
          </Typography>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Jobs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ bgcolor: 'white', borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ bgcolor: 'white', borderRadius: 1 }}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    label="Location"
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    <MenuItem value="Kampala, Uganda">Kampala, Uganda</MenuItem>
                    <MenuItem value="Mbarara, Uganda">Mbarara, Uganda</MenuItem>
                    <MenuItem value="Mukono, Uganda">Mukono, Uganda</MenuItem>
                    <MenuItem value="BUshenyi, Uganda">Bushenyi, Uganda</MenuItem>
                    <MenuItem value="Masaka, Uganda">Masaka, Uganda</MenuItem>
                    <MenuItem value="Hoima, Uganda">Hoima, Uganda</MenuItem>
                    <MenuItem value="Wakiso, Uganda">Wakiso, Uganda</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ bgcolor: 'white', borderRadius: 1 }}>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Job Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ height: '100%', bgcolor: 'secondary.main' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Jobs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {featuredJobs.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {job.company} • {job.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {job.type} • {job.category} • {job.experienceLevel}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {job.description.substring(0, 150)}...
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Salary: ${job.salary.toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBriefcase className="feature-icon" />
            <h3>Millions of Jobs</h3>
            <p>Search through millions of jobs and find the right fit.</p>
          </div>
          <div className="feature-card">
            <FaBuilding className="feature-icon" />
            <h3>Trusted Companies</h3>
            <p>Connect with verified employers and companies.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Find Your Community</h3>
            <p>Join our community of job seekers and employers.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Take the Next Step?</h2>
          <p>Join thousands of job seekers who have found their dream job through our platform.</p>
          <div className="cta-buttons">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/post-job')}
            >
              Post a Job
            </Button>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default Home; 
