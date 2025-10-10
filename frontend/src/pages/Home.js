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
    <Box sx={{ bgcolor: 'var(--primary-bg)', color: 'var(--text-light)', minHeight: '100vh' }}>
      {/* Navbar */}
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'var(--button-bg)',
          py: 10,
          textAlign: 'center',
          mt: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: 'var(--white)', mb: 2 }}>
            Hire Top Talent for Any Job — Fast
          </Typography>
          <Typography variant="h6" sx={{ color: 'var(--text-light)' }}>
            Connect with skilled freelancers and businesses in minutes.
          </Typography>
        </Container>
      </Box>

      {/* Featured Section */}
      <Box id="featured" sx={{ py: 5 }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: 'var(--white)', textAlign: 'center', mb: 4 }}
          >
            Featured Jobs
          </Typography>
          <Grid container spacing={3}>
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Grid item xs={12} sm={6} md={3} key={job._id}>
                  <Card sx={{ bgcolor: 'var(--button-bg)', color: 'var(--text-light)', textAlign: 'center' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'var(--white)', mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-lighter)' }}>
                        Difficulty: {job.difficulty}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-lighter)' }}>
                        Status: {job.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ color: 'var(--text-light)', width: '100%', textAlign: 'center', mt: 2 }}>
                No featured jobs available.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box id="categories" sx={{ py: 5, bgcolor: 'var(--primary-bg)' }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: 'var(--white)', textAlign: 'center', mb: 4 }}
          >
            Categories
          </Typography>
          <Grid container spacing={3}>
            {['Web Development', 'Graphic Design', 'Writing & Translation', 'Marketing'].map(
              (category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ bgcolor: 'var(--button-bg)', color: 'var(--text-light)', textAlign: 'center' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'var(--white)' }}>
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
          bgcolor: 'var(--header-bg)',
          color: 'var(--text-light)',
        }}
      >
        <Typography>© 2025 PBuild. All rights reserved.</Typography>
        <Typography>About | Privacy Policy | Terms of Service</Typography>
      </Box>
    </Box>
  );
};

export default Home;
