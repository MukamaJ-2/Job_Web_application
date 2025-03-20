import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createJob } from '../redux/slices/jobSlice';

const JobCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.jobs);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    category: '',
    description: '',
    requirements: '',
    benefits: '',
    salary: '',
    experienceLevel: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.type) errors.type = 'Job type is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';
    if (!formData.benefits.trim()) errors.benefits = 'Benefits are required';
    if (!formData.salary) errors.salary = 'Salary is required';
    if (!formData.experienceLevel) errors.experienceLevel = 'Experience level is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createJob(formData)).unwrap();
      navigate('/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Job Posting
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!validationErrors.title}
                  helperText={validationErrors.title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={!!validationErrors.company}
                  helperText={validationErrors.company}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!validationErrors.location}
                  helperText={validationErrors.location}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.type}>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Job Type"
                  >
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                  {validationErrors.type && (
                    <Typography color="error" variant="caption">
                      {validationErrors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {validationErrors.category && (
                    <Typography color="error" variant="caption">
                      {validationErrors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!validationErrors.experienceLevel}>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    label="Experience Level"
                  >
                    <MenuItem value="Entry Level">Entry Level</MenuItem>
                    <MenuItem value="Mid Level">Mid Level</MenuItem>
                    <MenuItem value="Senior Level">Senior Level</MenuItem>
                    <MenuItem value="Lead">Lead</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                  </Select>
                  {validationErrors.experienceLevel && (
                    <Typography color="error" variant="caption">
                      {validationErrors.experienceLevel}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  error={!!validationErrors.salary}
                  helperText={validationErrors.salary}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!validationErrors.description}
                  helperText={validationErrors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements"
                  name="requirements"
                  multiline
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  error={!!validationErrors.requirements}
                  helperText={validationErrors.requirements}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Benefits"
                  name="benefits"
                  multiline
                  rows={4}
                  value={formData.benefits}
                  onChange={handleChange}
                  error={!!validationErrors.benefits}
                  helperText={validationErrors.benefits}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/jobs')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    Create Job
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default JobCreate; 