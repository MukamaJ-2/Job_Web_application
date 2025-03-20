import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Container } from '@mui/material';
import { WorkOutline, BookmarkBorder, Description, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const dashboardItems = [
    {
      title: 'Browse Jobs',
      icon: <WorkOutline sx={{ fontSize: 40 }} />,
      description: 'Search and apply for jobs that match your skills',
      action: () => navigate('/jobs'),
      color: '#2196f3'
    },
    {
      title: 'My Applications',
      icon: <Description sx={{ fontSize: 40 }} />,
      description: 'Track your job applications and their status',
      action: () => navigate('/my-applications'),
      color: '#4caf50'
    },
    {
      title: 'Saved Jobs',
      icon: <BookmarkBorder sx={{ fontSize: 40 }} />,
      description: "View jobs you've saved for later",
      action: () => navigate('/saved-jobs'),
      color: '#ff9800'
    },
    {
      title: 'My Profile',
      icon: <Person sx={{ fontSize: 40 }} />,
      description: 'Update your profile and resume',
      action: () => navigate('/profile'),
      color: '#9c27b0'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your job search and applications from your dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: item.color, mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography gutterBottom variant="h6" component="h2">
                  {item.title}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {item.description}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={item.action}
                  sx={{ 
                    mt: 'auto',
                    backgroundColor: item.color,
                    '&:hover': {
                      backgroundColor: item.color,
                      opacity: 0.9
                    }
                  }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 