import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  Paper,
  Stack,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  TrendingUp,
  Business,
  Code,
  HealthAndSafety,
  AccountBalance,
  School,
  Restaurant,
  Build,
  LocalShipping,
} from '@mui/icons-material';
import { fetchJobs } from '../store/slices/jobSlice';
import FeaturedJobs from './FeaturedJobs';

const popularCategories = [
  { title: 'Technology', icon: <Code />, count: 1234 },
  { title: 'Healthcare', icon: <HealthAndSafety />, count: 856 },
  { title: 'Finance', icon: <AccountBalance />, count: 743 },
  { title: 'Education', icon: <School />, count: 652 },
  { title: 'Hospitality', icon: <Restaurant />, count: 534 },
  { title: 'Engineering', icon: <Build />, count: 423 },
  { title: 'Business', icon: <Business />, count: 367 },
  { title: 'Logistics', icon: <LocalShipping />, count: 289 },
];

const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search functionality
    navigate('/jobs');
  };

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <FeaturedJobs />
      </Container>
    </Box>
  );
};

export default Home; 