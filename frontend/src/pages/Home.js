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
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  TrendingUp,
  Category,
  Star,
  ArrowForward,
  WorkOutline,
  Groups,
  Speed,
} from '@mui/icons-material';
import { fetchJobs } from '../services/api';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const categories = [
    { name: 'Web Development', icon: '💻', count: '124 jobs' },
    { name: 'Graphic Design', icon: '🎨', count: '89 jobs' },
    { name: 'Writing & Translation', icon: '✍️', count: '156 jobs' },
    { name: 'Digital Marketing', icon: '📈', count: '102 jobs' },
  ];

  const stats = [
    { number: '10K+', label: 'Active Freelancers' },
    { number: '5K+', label: 'Completed Jobs' },
    { number: '98%', label: 'Success Rate' },
    { number: '4.9/5', label: 'Client Rating' },
  ];

  return (
    <Box sx={{ 
      bgcolor: 'var(--color-bg)', 
      color: 'var(--color-text)', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-warm-100) 100%)'
    }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #d35400 100%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip 
            icon={<Star sx={{ color: 'white !important' }} />} 
            label="Trusted by 50,000+ Businesses" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              mb: 3,
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              mb: 3,
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Hire Top Talent for Any Job — Fast
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 4,
              fontWeight: 300
            }}
          >
            Connect with skilled freelancers and businesses in minutes. 
            Quality work delivered on time, every time.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/jobs"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: 'var(--color-primary)',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'var(--color-warm-100)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Find Talent
            </Button>
            <Button
              component={RouterLink}
              to="/post-job"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                }
              }}
            >
              Post a Job
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'var(--color-warm-100)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'var(--color-primary)',
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              {/* Featured Jobs Section */}
              <Box id="featured" sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{ 
                      color: 'var(--color-text)',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <WorkOutline sx={{ color: 'var(--color-primary)' }} />
                    Featured Jobs
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/jobs"
                    endIcon={<ArrowForward />}
                    sx={{ color: 'var(--color-primary)' }}
                  >
                    View All
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  {featuredJobs.length > 0 ? (
                    featuredJobs.map((job, index) => (
                      <Grid item xs={12} sm={6} key={job._id}>
                        <RouterLink to={`/job/${job._id}`} style={{ textDecoration: 'none' }}>
                          <Card
                            onMouseEnter={() => setHoveredCard(job._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            sx={{
                              bgcolor: 'var(--color-card-bg)',
                              color: 'var(--color-text)',
                              cursor: 'pointer',
                              border: '1px solid var(--color-border)',
                              height: '100%',
                              transition: 'all 0.3s ease',
                              transform: hoveredCard === job._id ? 'translateY(-8px)' : 'none',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                                transform: hoveredCard === job._id ? 'scaleX(1)' : 'scaleX(0)',
                                transition: 'transform 0.3s ease'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    color: 'var(--color-text)',
                                    fontWeight: 600,
                                    lineHeight: 1.3
                                  }}
                                >
                                  {job.title}
                                </Typography>
                                <Chip 
                                  label={job.status} 
                                  size="small"
                                  color={job.status === 'open' ? 'success' : 'default'}
                                  sx={{ 
                                    bgcolor: job.status === 'open' ? 'var(--color-success)' : 'var(--color-text-lighter)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                              
                              <Typography 
                                variant="h5" 
                                sx={{ 
                                  color: 'var(--color-primary)',
                                  fontWeight: 'bold',
                                  mb: 2
                                }}
                              >
                                {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: 'var(--color-text-gray)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  ⭐ 4.8 • 12 proposals
                                </Typography>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: job.status === 'open' ? 'var(--color-success)' : 'var(--color-warning)',
                                    animation: job.status === 'open' ? 'pulse 2s infinite' : 'none'
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </RouterLink>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Card sx={{ textAlign: 'center', py: 6, bgcolor: 'var(--color-warm-100)' }}>
                        <CardContent>
                          <WorkOutline sx={{ fontSize: 48, color: 'var(--color-text-lighter)', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
                            No featured jobs available
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--color-text-gray)', mb: 3 }}>
                            Check back later for new opportunities
                          </Typography>
                          <Button 
                            variant="contained" 
                            component={RouterLink} 
                            to="/post-job"
                          >
                            Post First Job
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Categories Section */}
              <Box id="categories">
                <Typography
                  variant="h4"
                  sx={{ 
                    color: 'var(--color-text)',
                    textAlign: 'center',
                    mb: 4,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <Category sx={{ color: 'var(--color-primary)' }} />
                  Popular Categories
                </Typography>
                <Grid container spacing={3}>
                  {categories.map((category, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card 
                        sx={{ 
                          bgcolor: 'var(--color-card-bg)',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid var(--color-border)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: 'var(--color-primary)',
                            boxShadow: '0 8px 25px rgba(230, 126, 34, 0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Typography variant="h3" sx={{ mb: 2 }}>
                            {category.icon}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'var(--color-text)',
                              mb: 1,
                              fontWeight: 600
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'var(--color-primary)',
                              fontWeight: 'bold'
                            }}
                          >
                            {category.count}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Leaderboard />
                
                {/* Quick Stats Card */}
                <Card sx={{ bgcolor: 'var(--color-card-bg)', mt: 3, border: '1px solid var(--color-border)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'var(--color-text)',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <TrendingUp sx={{ color: 'var(--color-primary)' }} />
                      Platform Insights
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      {[
                        { label: 'Avg. Response Time', value: '2.3 hours' },
                        { label: 'Project Success Rate', value: '97.8%' },
                        { label: 'Active Freelancers', value: '12,458' },
                      ].map((stat, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 'bold' }}>
                            {stat.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 4,
          bgcolor: 'var(--color-header-bg)',
          color: 'var(--color-text)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
            PBuild
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            {['About', 'Privacy Policy', 'Terms of Service', 'Contact', 'Help Center'].map((item) => (
              <Typography 
                key={item} 
                variant="body2" 
                sx={{ 
                  color: 'var(--color-text-gray)',
                  cursor: 'pointer',
                  '&:hover': { color: 'var(--color-primary)' }
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--color-text-lighter)' }}>
            © 2025 PBuild. Connecting talent with opportunity.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;