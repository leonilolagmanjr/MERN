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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  alpha,
} from '@mui/material';
import {
  Search,
  WorkOutline,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Category,
  FilterList,
  Clear,
  TrendingUp,
} from '@mui/icons-material';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const jobsPerPage = 9;

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

  // Extract unique categories and locations
  const categories = ['all', ...new Set(jobs.map(job => job.category).filter(Boolean))];
  const locations = ['all', ...new Set(jobs.map(job => 
    job.location ? (job.location.type === 'physical' ? job.location.address : 'Remote') : 'Remote'
  ))];
  const statuses = ['all', ...new Set(jobs.map(job => job.status).filter(Boolean))];

  const handleSearch = () => {
    let filtered = jobs;

    // Search by title
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => 
        job.location ? 
          (job.location.type === 'physical' ? job.location.address === selectedLocation : selectedLocation === 'Remote') 
          : selectedLocation === 'Remote'
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(job => {
        const price = job.price || 0;
        switch (priceRange) {
          case 'under-50': return price < 50;
          case '50-100': return price >= 50 && price < 100;
          case '100-500': return price >= 100 && price < 500;
          case 'over-500': return price >= 500;
          default: return true;
        }
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedStatus('all');
    setPriceRange('all');
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'success';
      case 'closed': return 'error';
      case 'in progress': return 'warning';
      default: return 'default';
    }
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' || 
                           selectedStatus !== 'all' || priceRange !== 'all';

  return (
    <Box sx={{ 
      bgcolor: 'var(--color-bg)', 
      color: 'var(--color-text)', 
      minHeight: '100vh',
      py: 4,
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-warm-100) 50%, var(--color-bg) 100%)'
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'var(--color-text)',
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Find Your Perfect Project
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4
            }}
          >
            Discover amazing opportunities from top clients. Filter by category, location, or budget to find projects that match your skills.
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Card sx={{ 
          bgcolor: 'var(--color-card-bg)',
          mb: 6,
          p: 4,
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FilterList sx={{ color: 'var(--color-primary)' }} />
            <Typography variant="h6" sx={{ color: 'var(--color-text)', fontWeight: 'bold' }}>
              Search & Filter
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="end">
            {/* Search Input */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'var(--color-text-gray)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-gray)' }}>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                  sx={{
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-primary)',
                    },
                  }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-gray)' }}>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  label="Location"
                  sx={{
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-primary)',
                    },
                  }}
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  {locations.filter(loc => loc !== 'all').map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-gray)' }}>Budget</InputLabel>
                <Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  label="Budget"
                  sx={{
                    bgcolor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-primary)',
                    },
                  }}
                >
                  <MenuItem value="all">Any Budget</MenuItem>
                  <MenuItem value="under-50">Under $50</MenuItem>
                  <MenuItem value="50-100">$50 - $100</MenuItem>
                  <MenuItem value="100-500">$100 - $500</MenuItem>
                  <MenuItem value="over-500">$500+</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  fullWidth
                  sx={{
                    bgcolor: 'var(--color-primary)',
                    borderRadius: '50px',
                    py: 1,
                    '&:hover': {
                      bgcolor: 'var(--color-secondary)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Search
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<Clear />}
                    sx={{
                      borderRadius: '50px',
                      borderColor: 'var(--color-error)',
                      color: 'var(--color-error)',
                      minWidth: 'auto',
                      px: 2,
                      '&:hover': {
                        borderColor: 'var(--color-error)',
                        bgcolor: alpha('var(--color-error)', 0.1),
                      },
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Results Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/jobmanager"
              startIcon={<WorkOutline />}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: '50px',
                '&:hover': {
                  bgcolor: alpha('var(--color-primary)', 0.1),
                  borderColor: 'var(--color-primary)',
                },
              }}
            >
              Manage Your Jobs
            </Button>
          </Box>
        </Card>

        {/* Jobs Grid */}
        {currentJobs.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {currentJobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Link to={`/job/${job._id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      onMouseEnter={() => setHoveredCard(job._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      sx={{
                        bgcolor: 'var(--color-card-bg)',
                        color: 'var(--color-text)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
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
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover': {
                          boxShadow: '0 16px 40px rgba(230, 126, 34, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header with Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip
                            label={job.status || 'Open'}
                            color={getStatusColor(job.status)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'var(--color-primary)',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <AttachMoney fontSize="small" />
                            {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                          </Typography>
                        </Box>

                        {/* Job Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'var(--color-text)',
                            mb: 2,
                            fontWeight: 600,
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {job.title}
                        </Typography>

                        {/* Job Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'var(--color-text-gray)',
                            mb: 3,
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5,
                          }}
                        >
                          {job.description || 'No description provided.'}
                        </Typography>

                        {/* Job Details */}
                        <Box sx={{ space: 1.5 }}>
                          {job.category && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Category sx={{ fontSize: 18, color: 'var(--color-text-lighter)' }} />
                              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                {job.category}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 18, color: 'var(--color-text-lighter)' }} />
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                              {job.location ? (job.location.type === 'physical' ? job.location.address : 'Remote') : 'Remote'}
                            </Typography>
                          </Box>

                          {job.dateListed && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 18, color: 'var(--color-text-lighter)' }} />
                              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                {new Date(job.dateListed).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: 'var(--color-primary)',
                      color: 'white',
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          /* Empty State */
          <Card sx={{ 
            textAlign: 'center', 
            py: 8, 
            bgcolor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)'
          }}>
            <CardContent>
              <WorkOutline sx={{ fontSize: 64, color: 'var(--color-text-lighter)', mb: 2 }} />
              <Typography variant="h5" sx={{ color: 'var(--color-text)', mb: 2 }}>
                No jobs found
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--color-text-gray)', mb: 3 }}>
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Check back later for new job opportunities.'}
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="contained"
                  onClick={clearFilters}
                  startIcon={<Clear />}
                  sx={{
                    bgcolor: 'var(--color-primary)',
                    borderRadius: '50px',
                    px: 4,
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default BrowseJobs;