import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, LocationOn, Work } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../store/slices/jobSlice';

const Jobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
    experience: 'all',
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesLocation =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesType =
      filters.type === 'all' || job.type.toLowerCase() === filters.type.toLowerCase();

    const matchesExperience =
      filters.experience === 'all' ||
      job.experience.toLowerCase() === filters.experience.toLowerCase();

    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search jobs..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Job Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="full-time">Full Time</MenuItem>
                <MenuItem value="part-time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Experience</InputLabel>
              <Select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                label="Experience"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="entry">Entry Level</MenuItem>
                <MenuItem value="mid">Mid Level</MenuItem>
                <MenuItem value="senior">Senior Level</MenuItem>
                <MenuItem value="executive">Executive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Job Listings */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs?.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {job.company}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          icon={<LocationOn />}
                          label={job.location}
                          size="small"
                        />
                        <Chip
                          icon={<Work />}
                          label={job.type}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" paragraph>
                        {job.description.substring(0, 200)}...
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                      }}
                    >
                      <Typography variant="h6" color="primary" gutterBottom>
                        {job.salary}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/jobs/${job.id}`)}
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
      )}
    </Container>
  );
};

export default Jobs; 