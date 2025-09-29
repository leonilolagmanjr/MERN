import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasks } from '../services/api';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';

const Job = () => {
  const { jobId } = useParams(); // Get job ID from the URL
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const tasks = await fetchTasks(); // Fetch all tasks
        const selectedJob = tasks.find((task) => task._id === jobId); // Find the specific job
        if (selectedJob) {
          setJob(selectedJob);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details');
      }
    };
    fetchJobDetails();
  }, [jobId]);

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ textAlign: 'center' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2, color: '#c7d5e0' }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', py: 5 }}>
      <Container>
        <Typography variant="h3" sx={{ color: '#ffffff', mb: 3 }}>
          {job.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#c7d5e0', mb: 2 }}>
          {job.description}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Difficulty:</strong> {job.difficulty}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Category:</strong> {job.category}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Location:</strong> {job.location}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Status:</strong> {job.status}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a9b7c6', mb: 1 }}>
          <strong>Posted by:</strong> {job.createdBy.name}
        </Typography>
      </Container>
    </Box>
  );
};

export default Job;