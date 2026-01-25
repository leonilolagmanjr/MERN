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
  Fade,
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
  AccessTime,
  Verified,
  EmojiEvents,
  Add,
} from '@mui/icons-material';
import { fetchJobs } from '../services/api';
import Leaderboard from '../components/gamify/Leaderboard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchJobs(token);
        setJobs(data);
        setLoaded(true);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoaded(true);
      }
    };
    getJobs();
  }, []);

  // Helper to get 4 random jobs
  const getRandomJobs = (jobsArr, count = 4) => {
    if (!Array.isArray(jobsArr) || jobsArr.length === 0) return [];
    const shuffled = jobsArr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const featuredJobs = getRandomJobs(jobs);

  const categories = [
    { name: 'Web Development', icon: '💻', count: '124 jobs', color: '#A27B5C' },
    { name: 'Graphic Design', icon: '🎨', count: '89 jobs', color: '#3F4E4F' },
    { name: 'Writing & Translation', icon: '✍️', count: '156 jobs', color: '#2C3639' },
    { name: 'Digital Marketing', icon: '📈', count: '102 jobs', color: '#A27B5C' },
  ];

  const stats = [
    { number: '10K+', label: 'Active Freelancers', icon: <Groups /> },
    { number: '5K+', label: 'Completed Jobs', icon: <Verified /> },
    { number: '98%', label: 'Success Rate', icon: <EmojiEvents /> },
    { number: '4.9/5', label: 'Client Rating', icon: <Star /> },
  ];

  return (
    <Box sx={{ 
      bgcolor: '#2C3639', 
      color: '#DCD7C9', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(162, 123, 92, 0.08) 0%, transparent 30%),
          radial-gradient(circle at 80% 80%, rgba(63, 78, 79, 0.1) 0%, transparent 30%)
        `,
        zIndex: 0,
      }
    }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #A27B5C 0%, #8a6a50 100%)',
          py: { xs: 10, md: 15 },
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
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box>
              <Chip 
                icon={<Star sx={{ color: '#2C3639 !important' }} />} 
                label="Trusted by 50,000+ Businesses" 
                sx={{ 
                  bgcolor: 'rgba(44, 54, 57, 0.9)', 
                  color: '#DCD7C9', 
                  mb: 4,
                  px: 2,
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(220, 215, 201, 0.2)'
                }} 
              />
              
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#2C3639', 
                  mb: 3,
                  fontWeight: 'bold',
                  fontSize: { xs: '2.8rem', md: '4rem' },
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Hire Top Talent for Any Job — Fast
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(44, 54, 57, 0.95)', 
                  mb: 5,
                  fontWeight: 400,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Connect with skilled freelancers and businesses in minutes. 
                Quality work delivered on time, every time.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/jobs"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#2C3639',
                    color: '#DCD7C9',
                    px: 5,
                    py: 2,
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    border: '3px solid #2C3639',
                    minWidth: '180px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: '#3F4E4F',
                      borderColor: '#3F4E4F',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
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
                    borderColor: '#2C3639',
                    borderWidth: 3,
                    color: '#2C3639',
                    px: 5,
                    py: 1.8,
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: '180px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'rgba(44, 54, 57, 0.1)',
                      borderColor: '#3F4E4F',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  Post a Job
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: '#3F4E4F', position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Fade in timeout={800} delay={index * 200}>
                  <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    <Box sx={{ 
                      color: '#A27B5C', 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      '& svg': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#DCD7C9',
                        fontWeight: 'bold',
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#A27B5C',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              {/* Featured Jobs Section */}
              <Box id="featured" sx={{ mb: 10 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                  <Typography
                    variant="h3"
                    sx={{ 
                      color: '#DCD7C9',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <WorkOutline sx={{ color: '#A27B5C', fontSize: '2.5rem' }} />
                    Featured Jobs
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/jobs"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      color: '#A27B5C',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        color: '#DCD7C9'
                      }
                    }}
                  >
                    View All Jobs
                  </Button>
                </Box>
                
                {loaded && (
                  <Grid container spacing={4}>
                    {featuredJobs.length > 0 ? (
                      featuredJobs.map((job, index) => (
                        <Grid item xs={12} sm={6} key={job._id}>
                          <Fade in timeout={600} delay={index * 100}>
                            <RouterLink to={`/job/${job._id}`} style={{ textDecoration: 'none' }}>
                              <Card
                                onMouseEnter={() => setHoveredCard(job._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                sx={{
                                  bgcolor: '#3F4E4F',
                                  color: '#DCD7C9',
                                  cursor: 'pointer',
                                  border: '2px solid rgba(162, 123, 92, 0.3)',
                                  height: '100%',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  transform: hoveredCard === job._id ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                                    zIndex: 1,
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 3.5 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                                    <Typography 
                                      variant="h5" 
                                      sx={{ 
                                        color: '#DCD7C9',
                                        fontWeight: 700,
                                        lineHeight: 1.3,
                                        minHeight: '3.5rem'
                                      }}
                                    >
                                      {job.title}
                                    </Typography>
                                    <Chip 
                                      label={job.status} 
                                      size="small"
                                      sx={{ 
                                        bgcolor: job.status === 'open' ? '#A27B5C' : 'rgba(162, 123, 92, 0.3)',
                                        color: job.status === 'open' ? '#2C3639' : '#DCD7C9',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        height: '24px'
                                      }}
                                    />
                                  </Box>
                                  
                                  <Typography 
                                    variant="h4" 
                                    sx={{ 
                                      color: '#A27B5C',
                                      fontWeight: 'bold',
                                      mb: 2.5
                                    }}
                                  >
                                    {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AccessTime sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(220, 215, 201, 0.8)',
                                      }}
                                    >
                                      Posted {new Date(job.dateListed).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(220, 215, 201, 0.8)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                      }}
                                    >
                                      <Star sx={{ fontSize: '1rem', color: '#A27B5C' }} /> 4.8 • 12 proposals
                                    </Typography>
                                    <Box
                                      sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: job.status === 'open' ? '#A27B5C' : 'rgba(162, 123, 92, 0.5)',
                                        animation: job.status === 'open' ? 'pulse 2s infinite' : 'none',
                                        '@keyframes pulse': {
                                          '0%': { opacity: 1 },
                                          '50%': { opacity: 0.5 },
                                          '100%': { opacity: 1 },
                                        }
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </RouterLink>
                          </Fade>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Fade in>
                          <Card sx={{ 
                            textAlign: 'center', 
                            py: 8, 
                            bgcolor: 'rgba(63, 78, 79, 0.5)',
                            border: '2px dashed #A27B5C',
                            borderRadius: 3
                          }}>
                            <CardContent>
                              <WorkOutline sx={{ fontSize: 60, color: '#A27B5C', mb: 3, opacity: 0.7 }} />
                              <Typography variant="h4" sx={{ color: '#DCD7C9', mb: 2, fontWeight: 'bold' }}>
                                No featured jobs available
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 400, mx: 'auto' }}>
                                Check back later for new opportunities or be the first to post a job
                              </Typography>
                              <Button 
                                variant="contained" 
                                component={RouterLink} 
                                to="/post-job"
                                startIcon={<Add />}
                                sx={{
                                  bgcolor: '#A27B5C',
                                  color: '#2C3639',
                                  px: 4,
                                  py: 1.5,
                                  fontWeight: 'bold',
                                  fontSize: '1.1rem',
                                  '&:hover': {
                                    bgcolor: '#8a6a50',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                                  }
                                }}
                              >
                                Post Your First Job
                              </Button>
                            </CardContent>
                          </Card>
                        </Fade>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>

              {/* Categories Section */}
              <Box id="categories">
                <Typography
                  variant="h3"
                  sx={{ 
                    color: '#DCD7C9',
                    textAlign: 'center',
                    mb: 6,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Category sx={{ color: '#A27B5C', fontSize: '2.5rem' }} />
                  Popular Categories
                </Typography>
                <Grid container spacing={4}>
                  {categories.map((category, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Fade in timeout={600} delay={index * 100}>
                        <Card 
                          sx={{ 
                            bgcolor: '#3F4E4F',
                            color: '#DCD7C9',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '2px solid rgba(162, 123, 92, 0.3)',
                            height: '100%',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              borderColor: '#A27B5C',
                              boxShadow: '0 16px 40px rgba(162, 123, 92, 0.3)',
                              '& .category-icon': {
                                transform: 'scale(1.1) rotate(5deg)',
                              }
                            }
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <Typography 
                              variant="h1" 
                              className="category-icon"
                              sx={{ 
                                mb: 3,
                                transition: 'transform 0.3s ease',
                                fontSize: '4rem',
                                lineHeight: 1
                              }}
                            >
                              {category.icon}
                            </Typography>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                color: '#DCD7C9',
                                mb: 2,
                                fontWeight: 700,
                                minHeight: '3rem'
                              }}
                            >
                              {category.name}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#A27B5C',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                              }}
                            >
                              {category.count}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Fade in timeout={800} delay={400}>
                  <Box>
                    <Leaderboard />
                    
                    {/* Quick Stats Card */}
                    <Card sx={{ 
                      bgcolor: '#3F4E4F', 
                      mt: 4, 
                      border: '2px solid #A27B5C',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                      }
                    }}>
                      <CardContent sx={{ p: 3.5 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: '#DCD7C9',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            fontWeight: 'bold'
                          }}
                        >
                          <TrendingUp sx={{ color: '#A27B5C' }} />
                          Platform Insights
                        </Typography>
                        <Box sx={{ space: 2 }}>
                          {[
                            { label: 'Avg. Response Time', value: '2.3 hours', icon: <Speed /> },
                            { label: 'Project Success Rate', value: '97.8%', icon: <EmojiEvents /> },
                            { label: 'Active Freelancers', value: '12,458', icon: <Groups /> },
                          ].map((stat, index) => (
                            <Box key={index} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 1.5,
                              borderBottom: index < 2 ? '1px solid rgba(162, 123, 92, 0.2)' : 'none'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ color: '#A27B5C' }}>
                                  {stat.icon}
                                </Box>
                                <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.9)' }}>
                                  {stat.label}
                                </Typography>
                              </Box>
                              <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 'bold' }}>
                                {stat.value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Fade>
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
          py: 6,
          bgcolor: '#2C3639',
          color: '#DCD7C9',
          borderTop: '2px solid #A27B5C',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3, color: '#A27B5C', fontWeight: 'bold' }}>
            PBuild
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: '#DCD7C9', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
            Building the future of freelance collaboration and professional connections
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
            {['About', 'Privacy Policy', 'Terms of Service', 'Contact', 'Help Center'].map((item) => (
              <Typography 
                key={item} 
                variant="body1" 
                sx={{ 
                  color: 'rgba(220, 215, 201, 0.8)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': { 
                    color: '#A27B5C',
                    textDecoration: 'underline' 
                  }
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
          
          <Typography variant="body2" sx={{ 
            color: 'rgba(220, 215, 201, 0.6)',
            pt: 3,
            borderTop: '1px solid rgba(162, 123, 92, 0.3)'
          }}>
            © {new Date().getFullYear()} PBuild. Connecting talent with opportunity. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;