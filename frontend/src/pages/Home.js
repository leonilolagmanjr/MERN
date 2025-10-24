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
import { Link as RouterLink } from 'react-router-dom';
import { fetchPostedJobs } from '../services/api';
import Leaderboard from '../components/Leaderboard';
import { fetchJobs } from '../services/api';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchJobs(token);
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

      {/* Main Content and Sidebar */}
      <Box sx={{ py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              {/* Featured Section */}
              <Box id="featured" sx={{ mb: 5 }}>
                <Typography
                  variant="h4"
                  sx={{ color: 'var(--color-text)', textAlign: 'center', mb: 4 }}
                >
                  Featured Jobs
                </Typography>
                <Grid container spacing={3}>
                  {featuredJobs.length > 0 ? (
                    featuredJobs.map((job) => (
                      <Grid item xs={12} sm={6} md={6} key={job._id}>
                        <RouterLink
                          to={`/job/${job._id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Card
                            sx={{
                              width: '190px',
                              height: '180px',
                              bgcolor: 'var(--color-card-bg)',
                              color: 'var(--color-text)',
                              textAlign: 'center',
                              cursor: 'pointer',
                              '&:hover': {
                                boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3), 0 0 20px var(--color-primary)',
                                outline: '2px solid var(--color-primary)',
                              },
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
                                {job.title}
                              </Typography>
                              <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                              <Typography variant="body2" sx={{ color: 'var(--color-text-gray)', fontWeight: 'bold' }}>
                                {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                                Status: {job.status}
                              </Typography>
                            </CardContent>
                          </Card>
                        </RouterLink>
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', width: '100%', textAlign: 'center', mt: 2 }}>
                      No featured jobs available.
                    </Typography>
                  )}
                </Grid>
              </Box>

              {/* Categories Section */}
              <Box id="categories" sx={{ bgcolor: 'var(--color-bg)' }}>
                <Typography
                  variant="h4"
                  sx={{ color: 'var(--color-text)', textAlign: 'center', mb: 4 }}
                >
                  Categories
                </Typography>
                <Grid container spacing={3}>
                  {['Web Development', 'Graphic Design', 'Writing & Translation', 'Marketing'].map(
                    (category, index) => (
                      <Grid item xs={12} sm={6} md={6} key={index}>
                        <Card sx={{ width: '190px', height: '100px', bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)', textAlign: 'center' }}>
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
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Leaderboard />
            </Grid>
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
