import React, { useState, useEffect } from 'react';
import CreateJob from '../components/jobs/CreateJob';
import UpdateJob from '../components/jobs/UpdateJob';
import DeleteJob from '../components/jobs/DeleteJob';
import ViewCandidates from '../components/jobs/ViewCandidates';
import { Modal } from '@mui/material';
import { fetchPostedJobs } from '../services/api';
import { fetchJobs } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';

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
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterPrice) {
      filtered = filtered.filter((job) => job.price.toString().includes(filterPrice));
    }
    setFilteredJobs(filtered);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
          Browse Jobs
        </Typography>

        {/* User Posted Jobs Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
          <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)', fontWeight: 'bold' }} onClick={() => setOpenCreate(true)}>
            Create Job
          </Button>
        </Box>
  
        {/* User Posted Jobs - Steam-style Table - MOVED TO TOP */}
        <Box sx={{ bgcolor: 'var(--color-card-bg)', borderRadius: 2, boxShadow: 3, mb: 4, p: 2 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 2 }}>
            My Posted Jobs ({userJobs.length})
          </Typography>
          {/* Table Labels */}
          <Box sx={{ display: 'flex', px: 2, py: 1, bgcolor: 'var(--color-bg)', borderRadius: 1, fontWeight: 'bold', color: 'var(--color-text)', fontSize: 16 }}>
            <Box sx={{ flex: 2 }}>Name</Box>
            <Box sx={{ flex: 1 }}>Date Listed</Box>
            <Box sx={{ flex: 1 }}>Status</Box>
            <Box sx={{ flex: 1, textAlign: 'right' }}>Actions</Box>
          </Box>
          {/* Table Rows */}
          {userJobs.length === 0 ? (
            <Box sx={{ px: 2, py: 2, color: 'var(--color-text-gray)' }}>
              You are not selling any items on the Community Market. Sell items from your inventory, or click the "Create Job" button above.
            </Box>
          ) : (
            userJobs.map((job) => (
              <Box key={job._id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid var(--color-accent)', ':last-child': { borderBottom: 'none' } }}>
                {/* Name and description */}
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* If you have an image for the job, show it here. Otherwise, use a placeholder. */}
                  <Box sx={{ width: 48, height: 48, bgcolor: 'var(--color-bg)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    {/* Placeholder icon or image */}
                    <img src={job.imageUrl || '/android-chrome-192x192.png'} alt="job" style={{ width: 40, height: 40, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{job.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                  </Box>
                </Box>
                {/* Date Listed */}
                <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{new Date(job.dateListed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Box>
                {/* Status */}
                <Box sx={{ flex: 1, color: 'var(--color-primary)', fontWeight: 'bold' }}>Active</Box>
                {/* Actions Buttons */}
                <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    sx={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'none' }}
                    onClick={() => handleViewCandidates(job)}
                  >
                    View Candidates
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'none' }}
                    onClick={() => handleEdit(job)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: 'var(--color-error)', fontWeight: 'bold', textTransform: 'none' }}
                    onClick={() => handleDelete(job)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
        
        {/* All Jobs label and search/filter box side by side - MOVED TO BOTTOM */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, gap: 3 }}>
          {/* All Jobs table and label */}
          <Box sx={{ flex: 2 }}>
            <Box sx={{ bgcolor: 'var(--color-card-bg)', borderRadius: 2, boxShadow: 3, p: 2 }}>
              <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 2 }}>
                All Jobs ({filteredJobs.length})
              </Typography>
              {/* Table Labels */}
              <Box sx={{ display: 'flex', px: 2, py: 1, bgcolor: 'var(--color-bg)', borderRadius: 1, fontWeight: 'bold', color: 'var(--color-text)', fontSize: 16 }}>
                <Box sx={{ flex: 2 }}>Name</Box>
                <Box sx={{ flex: 1 }}>Date Listed</Box>
                <Box sx={{ flex: 1 }}>Price</Box>
                <Box sx={{ flex: 1 }}>Category</Box>
                <Box sx={{ flex: 1 }}>Location</Box>
              </Box>
              {/* Table Rows */}
              {filteredJobs.length === 0 ? (
                <Box sx={{ px: 2, py: 2, color: 'var(--color-text-gray)' }}>
                  No jobs available.
                </Box>
              ) : (
                filteredJobs.map((job) => (
                  <Box key={job._id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid var(--color-accent)', ':last-child': { borderBottom: 'none' }, bgcolor: 'var(--color-card-bg)', borderRadius: 1, mb: 1 }}>
                    {/* Name and description */}
                    <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: 'var(--color-bg)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      <img src={job.imageUrl || '/android-chrome-192x192.png'} alt="job" style={{ width: 40, height: 40, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                          <Link to={`/job/${job._id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                            {job.title}
                          </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-gray)' }}>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</Typography>
                      </Box>
                    </Box>
                    {/* Date Listed */}
                    <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{new Date(job.dateListed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Box>
                    {/* Price */}
                    <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}</Box>
                    {/* Category */}
                    <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{job.category}</Box>
                    {/* Location */}
                    <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{job.location ? (job.location.type === 'physical' ? job.location.address : 'Remote') : 'Remote'}</Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
          {/* Search/filter box styled like Steam sidebar */}
          <Box sx={{ flex: 1, bgcolor: 'var(--color-card-bg)', borderRadius: 2, boxShadow: 3, p: 2, minWidth: 320 }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--color-primary)', mb: 2, fontWeight: 'bold' }}>
              Search & Filter
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search jobs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                bgcolor: 'var(--color-card-bg)',
                input: { color: 'var(--color-text)' },
                mb: 2,
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
                mb: 2,
                width: '100%',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#5aafde' },
              }}
            >
              Search
            </Button>
            {/* Filter options */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text)', mb: 1 }}>
                Filter by Price
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Enter price (e.g., 100)"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                fullWidth
                sx={{
                  bgcolor: 'var(--color-card-bg)',
                  input: { color: 'var(--color-text)' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
  
        {/* Modals for Job Actions - Keep these at the bottom */}
        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            {/* Removed duplicate Create Job header */}
            {/* <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>Create Job</Typography> */}
            <CreateJob onJobCreated={() => { setOpenCreate(false); triggerRefresh(); }} />
            <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: 'var(--color-bg)', bgcolor: 'var(--color-error)', textTransform: 'none' }}>Close</Button>
          </Box>
        </Modal>
        <Modal open={openUpdate} onClose={() => { setOpenUpdate(false); setSelectedJob(null); }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>Update Job</Typography>
            <UpdateJob job={selectedJob} onJobUpdated={() => { setOpenUpdate(false); setSelectedJob(null); triggerRefresh(); }} onClose={() => { setOpenUpdate(false); setSelectedJob(null); }} />
            <Button onClick={() => { setOpenUpdate(false); setSelectedJob(null); }} sx={{ mt: 2, color: 'var(--color-bg)', bgcolor: 'var(--color-error)', textTransform: 'none' }}>Close</Button>
          </Box>
        </Modal>
        <Modal open={openDelete} onClose={() => { setOpenDelete(false); setSelectedJob(null); }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <DeleteJob job={selectedJob} onJobDeleted={() => { setOpenDelete(false); setSelectedJob(null); triggerRefresh(); }} onClose={() => { setOpenDelete(false); setSelectedJob(null); }} />
          </Box>
        </Modal>
        <ViewCandidates
          open={openCandidates}
          onClose={() => { setOpenCandidates(false); setSelectedJob(null); }}
          jobId={selectedJob?._id}
          jobTitle={selectedJob?.title}
        />

      </Box>
    </Box>
  );
};

export default JobManager;