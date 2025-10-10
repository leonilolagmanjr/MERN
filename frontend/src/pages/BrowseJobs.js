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
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', p: 3 }}>
      {/* Heading */}
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
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
            bgcolor: '#2a475e',
            input: { color: '#c7d5e0' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#66c0f4' },
              '&:hover fieldset': { borderColor: '#66c0f4' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            bgcolor: '#66c0f4',
            color: '#ffffff',
            '&:hover': { bgcolor: '#5aafde' },
          }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/jobmanager"
          sx={{
            bgcolor: '#66c0f4',
            color: '#ffffff',
            '&:hover': { bgcolor: '#5aafde' },
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
                bgcolor: '#2a475e',
                color: '#c7d5e0',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: '#ffffff', mb: 1 }}
                >
                  <Link
                    to={`/job/${job._id}`}
                    style={{ color: '#66c0f4', textDecoration: 'none' }}
                  >
                    {job.title}
                  </Link>
                </Typography>
                <Typography sx={{ mb: 1 }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Difficulty: {job.difficulty}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Category: {job.category}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  Location: {job.location ? (job.location.type === 'physical' ? job.location.address : 'Remote') : 'Remote'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
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