import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchAllJobs();
  }, []);

  const handleSearch = () => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#2C3639', 
      color: '#DCD7C9', 
      minHeight: '100vh',
      py: 5,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(162, 123, 92, 0.05) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(63, 78, 79, 0.08) 0%, transparent 20%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#DCD7C9',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <WorkIcon sx={{ fontSize: '2.5rem', color: '#A27B5C' }} />
            Browse Available Jobs
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#A27B5C',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Find your next opportunity from our curated list of jobs
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 6,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search jobs by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#3F4E4F',
                color: '#DCD7C9',
                borderRadius: 2,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(162, 123, 92, 0.5)',
                },
                '&.Mui-focused': {
                  borderColor: '#A27B5C',
                  boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
                }
              },
              '& .MuiInputLabel-root': {
                color: '#A27B5C',
              },
              '& .MuiOutlinedInput-input': {
                color: '#DCD7C9',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#A27B5C' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: '#A27B5C',
              color: '#2C3639',
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              border: '2px solid #A27B5C',
              minWidth: { xs: '100%', sm: 'auto' },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#8a6a50',
                borderColor: '#8a6a50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
              },
            }}
          >
            Search Jobs
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/jobmanager"
            sx={{
              bgcolor: 'transparent',
              color: '#A27B5C',
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              border: '2px solid #A27B5C',
              minWidth: { xs: '100%', sm: 'auto' },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(162, 123, 92, 0.1)',
                borderColor: '#8a6a50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(162, 123, 92, 0.2)',
              },
            }}
          >
            Manage Your Jobs
          </Button>
        </Box>

        {/* Results Count */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#DCD7C9',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SearchIcon sx={{ color: '#A27B5C' }} />
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </Typography>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <Grid container spacing={4}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Link
                  to={`/job/${job._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    sx={{
                      bgcolor: '#3F4E4F',
                      color: '#DCD7C9',
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '2px solid rgba(162, 123, 92, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(162, 123, 92, 0.3)',
                        borderColor: '#A27B5C',
                        '& .job-price': {
                          bgcolor: '#A27B5C',
                          color: '#2C3639',
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      p: 3 
                    }}>
                      {/* Job Title */}
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: '#DCD7C9',
                          mb: 2,
                          fontWeight: 'bold',
                          fontSize: '1.25rem',
                          minHeight: '3.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {job.title}
                      </Typography>
                      
                      {/* Description */}
                      <Typography 
                        sx={{ 
                          mb: 3, 
                          flexGrow: 1,
                          color: 'rgba(220, 215, 201, 0.8)',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {job.description}
                      </Typography>
                      
                      {/* Job Details */}
                      <Box sx={{ mt: 'auto' }}>
                        {/* Price Chip */}
                        <Chip
                          icon={<AttachMoneyIcon />}
                          label={`${(job.currency || 'USD') === 'USD' ? '$' : '₱'}${(job.price || 0).toFixed(2)}`}
                          className="job-price"
                          sx={{
                            bgcolor: 'rgba(162, 123, 92, 0.2)',
                            color: '#DCD7C9',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            mb: 2,
                            transition: 'all 0.3s ease',
                            '& .MuiChip-icon': {
                              color: '#DCD7C9',
                            }
                          }}
                        />
                        
                        {/* Details List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                              {job.category || 'Uncategorized'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                              {job.location ? (
                                job.location.type === 'physical' ? 
                                  `${job.location.address}` : 
                                  'Remote'
                              ) : 'Remote'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                              Posted {new Date(job.dateListed).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10,
            bgcolor: 'rgba(63, 78, 79, 0.3)',
            borderRadius: 3,
            border: '2px dashed #A27B5C'
          }}>
            <WorkIcon sx={{ fontSize: '4rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#DCD7C9', mb: 2 }}>
              No jobs found
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? `No jobs matching "${searchTerm}"` : 'No jobs available at the moment'}
            </Typography>
          </Box>
        )}

        {/* View All Button */}
        {searchTerm && filteredJobs.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="text"
              onClick={() => {
                setSearchTerm('');
                setFilteredJobs(jobs);
              }}
              sx={{
                color: '#A27B5C',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#DCD7C9',
                  bgcolor: 'transparent',
                }
              }}
            >
              View all jobs
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BrowseJobs;