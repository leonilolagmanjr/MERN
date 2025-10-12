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
} from '@mui/material';

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
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      {/* Heading */}
      <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
        Browse Jobs
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          justifyContent: 'center',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            bgcolor: 'var(--color-button-bg)',
            input: { color: 'var(--color-text)' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'var(--color-primary)' },
              '&:hover fieldset': { borderColor: 'var(--color-primary)' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            '&:hover': { bgcolor: 'var(--color-accent)' },
          }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/jobmanager"
          sx={{
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            '&:hover': { bgcolor: 'var(--color-accent)' },
          }}
        >
          Go to Job Manager
        </Button>
      </Box>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <Card
              sx={{
                bgcolor: 'var(--color-card-bg)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'var(--color-text)', mb: 1 }}
                >
                  <Link
                    to={`/job/${job._id}`}
                    style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                  >
                    {job.title}
                  </Link>
                </Typography>
                <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-gray)', textShadow: '0 0 10px #ffffff' }}>
                  Price: {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                  Category: {job.category}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                  Location: {job.location ? (job.location.type === 'physical' ? job.location.address : 'Remote') : 'Remote'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>
                  Date Listed: {new Date(job.dateListed).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrowseJobs;