import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Avatar,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Business,
  WorkOutline,
  AttachMoney,
  Timer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const featuredJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "Kampala, Uganda",
    salary: "UGX1,200,000 - UGX1,600,000",
    type: "Full-time",
    description: "Join our team to build cutting-edge web applications using React, Node.js, and cloud technologies.",
    logo: "TI",
    postedDate: "2 days ago"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Mukono, Uganda",
    salary: "UGX900,000 - UGX1,200,000",
    type: "Full-time",
    description: "Create beautiful and intuitive user interfaces for our digital products and services.",
    logo: "CS",
    postedDate: "1 week ago"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataMinds Analytics",
    location: "Nakawa, uganda",
    salary: "UGX1,000,000 - UGX1,040,000",
    type: "Full-time",
    description: "Apply machine learning and statistical analysis to solve complex business problems.",
    logo: "DM",
    postedDate: "3 days ago"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Cloud Systems Pro",
    location: "Austin, TX",
    salary: "Ugx1,100,000 - ugx1,500,000",
    type: "Remote",
    description: "Manage and optimize our cloud infrastructure using AWS, Docker, and Kubernetes.",
    logo: "CS",
    postedDate: "5 days ago"
  },
  {
    id: 5,
    title: "Product Manager",
    company: "Innovation Hub",
    location: "Mukono, Uganda",
    salary: "UGX1,300,000 - UGX1,700,000",
    type: "Hybrid",
    description: "Lead product development initiatives and drive innovation in our technology solutions.",
    logo: "IH",
    postedDate: "1 day ago"
  },
  {
    id: 6,
    title: "Full Stack Developer",
    company: "Digital Forge",
    location: "Denver, CO",
    salary: "UGX950,000 - UGX1,350,000",
    type: "Remote",
    description: "Build and maintain scalable web applications using modern JavaScript frameworks and backend technologies.",
    logo: "DF",
    postedDate: "Just now"
  },
  {
    id: 7,
    title: "AI/ML Engineer",
    company: "Future Tech Labs",
    location: "Nakawa, Uganda",
    salary: "UGX140,000 - UGX180,000",
    type: "Hybrid",
    description: "Develop and implement cutting-edge machine learning models and AI solutions for enterprise applications.",
    logo: "FT",
    postedDate: "4 days ago"
  },
  {
    id: 8,
    title: "Cloud Solutions Architect",
    company: "Global Systems Inc.",
    location: "Kampala, Uganda",
    salary: "UGX135,000 - UGX175,000",
    type: "Full-time",
    description: "Design and implement scalable cloud architecture solutions using AWS, Azure, and Google Cloud Platform.",
    logo: "GS",
    postedDate: "2 days ago"
  }
];

const FeaturedJobs = () => {
  const navigate = useNavigate();

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (!featuredJobs || featuredJobs.length === 0) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No featured jobs available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        Featured Jobs ({featuredJobs.length})
      </Typography>
      <Grid container spacing={3}>
        {featuredJobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job.id}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {job.logo}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Business sx={{ fontSize: 18, mr: 0.5 }} />
                      {job.company}
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                    {job.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AttachMoney sx={{ fontSize: 18, mr: 0.5 }} />
                    {job.salary}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Timer sx={{ fontSize: 18, mr: 0.5 }} />
                    {job.postedDate}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {job.description}
                </Typography>

                <Chip
                  icon={<WorkOutline />}
                  label={job.type}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewDetails(job.id)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedJobs; 