import React, { useState, useEffect } from 'react';
import CreateJob from '../components/jobs/CreateJob';
import UpdateJob from '../components/jobs/UpdateJob';
import DeleteJob from '../components/jobs/DeleteJob';
import ViewCandidates from '../components/jobs/ViewCandidates';
import { Modal, Box, Typography, TextField, Button, Container, Chip, IconButton, Grid, Paper } from '@mui/material';
import { fetchPostedJobs, fetchJobs } from '../services/api';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkIcon from '@mui/icons-material/Work';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';

const JobManager = () => {
  const [refreshJobs, setRefreshJobs] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [filterPrice, setFilterPrice] = useState('');

  const triggerRefresh = () => {
    setRefreshJobs(!refreshJobs);
  };

  // Modal state
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCandidates, setOpenCandidates] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleEdit = (job) => {
    setSelectedJob(job);
    setOpenUpdate(true);
  };

  const handleDelete = (job) => {
    setSelectedJob(job);
    setOpenDelete(true);
  };

  const handleViewCandidates = (job) => {
    setSelectedJob(job);
    setOpenCandidates(true);
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await fetchJobs();
        setAllJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    const fetchUserJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedJobs(token);
        setUserJobs(data);
      } catch (err) {
        console.error('Error fetching user jobs:', err);
      }
    };
    fetchAllJobs();
    fetchUserJobs();
  }, [refreshJobs]);

  const handleSearch = () => {
    let filtered = allJobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterPrice) {
      filtered = filtered.filter((job) => job.price.toString().includes(filterPrice));
    }
    setFilteredJobs(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterPrice('');
    setFilteredJobs(allJobs);
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
          radial-gradient(circle at 15% 25%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 85% 75%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            Job Manager
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
            Manage your job postings and browse available opportunities
          </Typography>
        </Box>

        {/* Create Job Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#8a6a50',
                borderColor: '#8a6a50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
              },
            }}
          >
            Create New Job
          </Button>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column: My Posted Jobs */}
          <Grid item xs={12} lg={8}>
            {/* My Posted Jobs Section */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                p: 4,
                borderRadius: 3,
                border: '2px solid #A27B5C',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#DCD7C9',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  <WorkIcon sx={{ color: '#A27B5C' }} />
                  My Posted Jobs
                  <Chip 
                    label={`${userJobs.length} total`} 
                    sx={{ 
                      bgcolor: 'rgba(162, 123, 92, 0.2)', 
                      color: '#DCD7C9',
                      fontWeight: 'bold',
                      ml: 1
                    }} 
                  />
                </Typography>
              </Box>

              {userJobs.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: 'rgba(44, 54, 57, 0.3)',
                  borderRadius: 2,
                  border: '2px dashed #A27B5C'
                }}>
                  <WorkIcon sx={{ fontSize: '4rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2 }}>
                    No jobs posted yet
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Create your first job posting to start hiring talent
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreate(true)}
                    sx={{
                      bgcolor: '#A27B5C',
                      color: '#2C3639',
                      '&:hover': {
                        bgcolor: '#8a6a50',
                      }
                    }}
                  >
                    Create First Job
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Table Header */}
                  <Grid container sx={{ 
                    bgcolor: '#2C3639', 
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    border: '1px solid rgba(162, 123, 92, 0.3)'
                  }}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        JOB DETAILS
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle2" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        DATE
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle2" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        STATUS
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" sx={{ color: '#A27B5C', fontWeight: 'bold', textAlign: 'right' }}>
                        ACTIONS
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Job Rows */}
                  {userJobs.map((job) => (
                    <Paper
                      key={job._id}
                      sx={{
                        bgcolor: '#2C3639',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        border: '1px solid rgba(162, 123, 92, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#A27B5C',
                          bgcolor: 'rgba(44, 54, 57, 0.9)',
                          boxShadow: '0 4px 12px rgba(162, 123, 92, 0.2)',
                        }
                      }}
                    >
                      <Grid container alignItems="center">
                        <Grid item xs={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                              width: 56, 
                              height: 56, 
                              bgcolor: 'rgba(162, 123, 92, 0.2)', 
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #A27B5C'
                            }}>
                              <WorkIcon sx={{ color: '#A27B5C', fontSize: '1.8rem' }} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 0.5 }}>
                                {job.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)', fontSize: '0.85rem' }}>
                                {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.8)' }}>
                            {new Date(job.dateListed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Chip 
                            label={job.status || 'Active'} 
                            size="small"
                            sx={{ 
                              bgcolor: '#A27B5C',
                              color: '#2C3639',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton
                              onClick={() => handleViewCandidates(job)}
                              sx={{
                                color: '#A27B5C',
                                '&:hover': {
                                  bgcolor: 'rgba(162, 123, 92, 0.1)',
                                }
                              }}
                              title="View Candidates"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(job)}
                              sx={{
                                color: '#A27B5C',
                                '&:hover': {
                                  bgcolor: 'rgba(162, 123, 92, 0.1)',
                                }
                              }}
                              title="Edit Job"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(job)}
                              sx={{
                                color: '#A27B5C',
                                '&:hover': {
                                  bgcolor: 'rgba(162, 123, 92, 0.1)',
                                }
                              }}
                              title="Delete Job"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Search & All Jobs */}
          <Grid item xs={12} lg={4}>
            {/* Search & Filter Card */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                p: 4,
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                mb: 4
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#DCD7C9',
                  mb: 3,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <FilterListIcon sx={{ color: '#A27B5C' }} />
                Search & Filter
              </Typography>

              <TextField
                fullWidth
                placeholder="Search jobs by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2C3639',
                    color: '#DCD7C9',
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
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
                  startAdornment: <SearchIcon sx={{ color: '#A27B5C', mr: 1 }} />,
                }}
              />

              <TextField
                fullWidth
                placeholder="Filter by price (e.g., 100)"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2C3639',
                    color: '#DCD7C9',
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
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
                  startAdornment: <AttachMoneyIcon sx={{ color: '#A27B5C', mr: 1 }} />,
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  fullWidth
                  sx={{
                    bgcolor: '#A27B5C',
                    color: '#2C3639',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    border: '2px solid #A27B5C',
                    '&:hover': {
                      bgcolor: '#8a6a50',
                      borderColor: '#8a6a50',
                    }
                  }}
                >
                  Search Jobs
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{
                    color: '#A27B5C',
                    borderColor: '#A27B5C',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderColor: '#8a6a50',
                    }
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Paper>

            {/* All Jobs Count */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                p: 3,
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#DCD7C9',
                  mb: 2,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <WorkIcon sx={{ color: '#A27B5C' }} />
                All Jobs Available
                <Chip 
                  label={`${filteredJobs.length} jobs`} 
                  sx={{ 
                    bgcolor: 'rgba(162, 123, 92, 0.2)', 
                    color: '#DCD7C9',
                    fontWeight: 'bold',
                    ml: 1
                  }} 
                />
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  to="/jobs"
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: '#A27B5C',
                    color: '#2C3639',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    border: '2px solid #A27B5C',
                    '&:hover': {
                      bgcolor: '#8a6a50',
                      borderColor: '#8a6a50',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                    }
                  }}
                >
                  Browse All Jobs
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Modals */}
        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 600 },
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AddIcon /> Create New Job
              </Typography>
              <IconButton 
                onClick={() => setOpenCreate(false)} 
                sx={{ 
                  color: '#A27B5C',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <CreateJob onJobCreated={() => { setOpenCreate(false); triggerRefresh(); }} />
          </Box>
        </Modal>

        <Modal open={openUpdate} onClose={() => { setOpenUpdate(false); setSelectedJob(null); }}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 600 },
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <EditIcon /> Update Job
              </Typography>
              <IconButton 
                onClick={() => { setOpenUpdate(false); setSelectedJob(null); }}
                sx={{ 
                  color: '#A27B5C',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <UpdateJob job={selectedJob} onJobUpdated={() => { setOpenUpdate(false); setSelectedJob(null); triggerRefresh(); }} onClose={() => { setOpenUpdate(false); setSelectedJob(null); }} />
          </Box>
        </Modal>

        <Modal open={openDelete} onClose={() => { setOpenDelete(false); setSelectedJob(null); }}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 500 },
            maxWidth: 600,
            outline: 'none'
          }}>
            <DeleteJob job={selectedJob} onJobDeleted={() => { setOpenDelete(false); setSelectedJob(null); triggerRefresh(); }} onClose={() => { setOpenDelete(false); setSelectedJob(null); }} />
          </Box>
        </Modal>

        <ViewCandidates
          open={openCandidates}
          onClose={() => { setOpenCandidates(false); setSelectedJob(null); }}
          jobId={selectedJob?._id}
          jobTitle={selectedJob?.title}
        />
      </Container>
    </Box>
  );
};

export default JobManager;