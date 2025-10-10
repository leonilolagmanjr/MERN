import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { 
  WorkOutline, 
  Category, 
  LocationOn, 
  Schedule, 
  Person 
} from '@mui/icons-material';
import { fetchJobs } from '../services/api';
import UserLink from '../components/UserLink';
import ApplyJob from '../components/jobs/ApplyJob';

// Constants for better maintainability
const JOB_STATUS_COLORS = {
  open: 'success',
  closed: 'error',
  in_progress: 'warning',
  completed: 'info'
};

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobs = await fetchJobs();
      const selectedJob = jobs.find((job) => job._id === jobId);
      
      if (selectedJob) {
        setJob(selectedJob);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to fetch job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApplySuccess = useCallback(() => {
    // Refresh job details to get updated candidates list
    fetchJobDetails();
  }, [fetchJobDetails]);

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get location display text
  const getLocationText = (location) => {
    if (!location) return 'Remote';
    return location.type === 'physical' ? location.address : 'Remote';
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        mt: 5 
      }}>
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: '#c7d5e0' }}>
          Loading job details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert 
          severity="error" 
          sx={{ textAlign: 'center' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchJobDetails}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="warning" sx={{ textAlign: 'center' }}>
          No job data available.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            bgcolor: '#2a475e',
            border: '1px solid #3c6382'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#ffffff', 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                {job.title}
              </Typography>
              
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Chip 
                  icon={<WorkOutline />}
                  label={job.status} 
                  color={JOB_STATUS_COLORS[job.status] || 'default'}
                  variant="outlined"
                />
                <Chip 
                  icon={<Category />}
                  label={job.category} 
                  variant="outlined"
                  sx={{ color: '#66c0f4' }}
                />
                <Chip 
                  icon={<LocationOn />}
                  label={getLocationText(job.location)} 
                  variant="outlined"
                />
              </Stack>
            </Box>
            
            <Box sx={{ minWidth: 200 }}>
              <ApplyJob 
                job={job} 
                onApplySuccess={handleApplySuccess} 
              />
            </Box>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Stack spacing={4} direction={{ xs: 'column', lg: 'row' }}>
          {/* Job Details */}
          <Box sx={{ flex: 2 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                bgcolor: '#2a475e',
                border: '1px solid #3c6382'
              }}
            >
              <Typography variant="h5" sx={{ color: '#ffffff', mb: 3 }}>
                Job Description
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#c7d5e0', 
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {job.description}
              </Typography>
            </Paper>
          </Box>

          {/* Sidebar with Additional Info */}
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                bgcolor: '#2a475e',
                border: '1px solid #3c6382'
              }}
            >
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
                Job Details
              </Typography>
              
              <Stack spacing={2}>
                {/* Difficulty */}
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#8f98a0', display: 'block', mb: 0.5 }}
                  >
                    DIFFICULTY
                  </Typography>
                  <Chip 
                    label={job.difficulty} 
                    color="primary"
                    variant="filled"
                    size="small"
                  />
                </Box>

                <Divider sx={{ borderColor: '#3c6382' }} />

                {/* Location */}
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#8f98a0', display: 'block', mb: 0.5 }}
                  >
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    LOCATION
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#c7d5e0' }}>
                    {getLocationText(job.location)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: '#3c6382' }} />

                {/* Deadline */}
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#8f98a0', display: 'block', mb: 0.5 }}
                  >
                    <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                    DEADLINE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#c7d5e0' }}>
                    {formatDate(job.deadline)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: '#3c6382' }} />

                {/* Posted By */}
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#8f98a0', display: 'block', mb: 0.5 }}
                  >
                    <Person sx={{ fontSize: 16, mr: 0.5 }} />
                    POSTED BY
                  </Typography>
                  <UserLink 
                    userId={job.createdBy._id} 
                    name={job.createdBy.name} 
                  />
                </Box>

                {/* Candidates Count */}
                {job.candidates && (
                  <>
                    <Divider sx={{ borderColor: '#3c6382' }} />
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#8f98a0', display: 'block', mb: 0.5 }}
                      >
                        APPLICATIONS
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#c7d5e0' }}>
                        {job.candidates.length} candidate{job.candidates.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default JobDetail;