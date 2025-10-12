import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  Link,
} from '@mui/material';
import { fetchPostedJobs } from '../services/api';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedJobs(token);
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    getJobs();
  }, []);

  // Helper to get 4 random jobs
  const getRandomJobs = (jobsArr, count = 4) => {
    if (!Array.isArray(jobsArr)) return [];
    const shuffled = jobsArr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const featuredJobs = getRandomJobs(jobs);

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Navbar */}
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'var(--color-button-bg)',
          py: 10,
          textAlign: 'center',
          mt: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: 'var(--color-text)', mb: 2 }}>
            Hire Top Talent for Any Job — Fast
          </Typography>
          <Typography variant="h6" sx={{ color: 'var(--color-text)' }}>
            Connect with skilled freelancers and businesses in minutes.
          </Typography>
        </Container>
      </Box>

      {/* Featured Section */}
      <Box id="featured" sx={{ py: 5 }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: 'var(--color-text)', textAlign: 'center', mb: 4 }}
          >
            Featured Jobs
          </Typography>
          <Grid container spacing={3}>
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Grid item xs={12} sm={6} md={3} key={job._id}>
                  <Card sx={{ bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)', textAlign: 'center' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                      <Typography variant="body2" sx={{ color: 'var(--color-text-gray)', textShadow: '0 0 10px #ffffff' }}>
                        Price: {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                        Status: {job.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ color: 'var(--color-text)', width: '100%', textAlign: 'center', mt: 2 }}>
                No featured jobs available.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box id="categories" sx={{ py: 5, bgcolor: 'var(--color-bg)' }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: 'var(--color-text)', textAlign: 'center', mb: 4 }}
          >
            Categories
          </Typography>
          <Grid container spacing={3}>
            {['Web Development', 'Graphic Design', 'Writing & Translation', 'Marketing'].map(
              (category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)', textAlign: 'center' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'var(--color-text)' }}>
                        {category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          bgcolor: 'var(--color-header-bg)',
          color: 'var(--color-text)',
        }}
      >
        <Typography>© 2025 PBuild. All rights reserved.</Typography>
        <Typography>About | Privacy Policy | Terms of Service</Typography>
      </Box>
    </Box>
  );
};

export default Home;
