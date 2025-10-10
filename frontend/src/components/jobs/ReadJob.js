import React, { useEffect, useState } from 'react';
import { fetchPostedJobs, deleteJob } from '../../services/api';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const ReadJob = ({ refresh }) => {
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
  }, [refresh]);

  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteJob(jobId, token);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId)); // Remove the job from the list
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#ffffff' }}>
        My Posted Jobs
      </Typography>
      <Grid container spacing={3}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card
                sx={{
                  bgcolor: '#2a475e',
                  color: '#c7d5e0',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                    {job.title}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Difficulty: {job.difficulty}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Status: {job.status}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={() => handleDelete(job._id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#c7d5e0' }}>
            No jobs available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ReadJob;