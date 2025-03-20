import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress
} from '@mui/material';
import { fetchJobs } from '../store/slices/jobSlice';

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    category: ''
  });

  // Get search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';

    setSearchQuery(search);
    setFilters({ location, type, category });
  }, [location]);

  // Fetch jobs when filters change
  useEffect(() => {
    console.log('Fetching jobs with filters:', { ...filters, search: searchQuery });
    dispatch(fetchJobs({ ...filters, search: searchQuery }));
  }, [dispatch, filters, searchQuery]);

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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const jobsPerPage = 10;
  const currentJobs = jobs?.slice((page - 1) * jobsPerPage, page * jobsPerPage) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Listings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSearch}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="New York, NY">New York, NY</MenuItem>
                  <MenuItem value="Boston, MA">Boston, MA</MenuItem>
                  <MenuItem value="San Francisco, CA">San Francisco, CA</MenuItem>
                  <MenuItem value="Chicago, IL">Chicago, IL</MenuItem>
                  <MenuItem value="Los Angeles, CA">Los Angeles, CA</MenuItem>
                  <MenuItem value="Seattle, WA">Seattle, WA</MenuItem>
                  <MenuItem value="Miami, FL">Miami, FL</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
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
                sx={{ height: '100%' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>

        <Grid container spacing={3}>
          {currentJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
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
                    {job.description.substring(0, 200)}...
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

        {jobs?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(jobs.length / jobsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default JobList; 