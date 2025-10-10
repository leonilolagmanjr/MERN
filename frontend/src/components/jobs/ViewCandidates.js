import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Check as AcceptIcon, Close as RejectIcon } from '@mui/icons-material';
import { fetchCandidates, removeCandidate, acceptCandidate, rejectCandidate } from '../../services/api';
import UserLink from '../UserLink';

const ViewCandidates = ({ open, onClose, jobId, jobTitle }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchCandidates(jobId, token);
      setCandidates(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      loadCandidates();
    }
  }, [open, jobId]);

  const handleRemoveCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      await removeCandidate(jobId, candidateId, token);
      // Reload the candidates list after removal
      await loadCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to remove candidate');
    }
  };

  const handleAcceptCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptCandidate(jobId, candidateId, token);
      // Reload the candidates list after acceptance
      await loadCandidates();
      // Close the modal since the job is now assigned
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to accept candidate');
    }
  };

  const handleRejectCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      await rejectCandidate(jobId, candidateId, token);
      // Reload the candidates list after rejection
      await loadCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reject candidate');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Candidates for "{jobTitle}"
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : candidates.length === 0 ? (
          <Typography>No candidates yet.</Typography>
        ) : (
          <List>
            {candidates.map((candidate) => (
              <ListItem key={candidate._id}>
                <ListItemText
                  primary={<UserLink userId={candidate._id} name={candidate.name} />}
                  secondary={candidate.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleAcceptCandidate(candidate._id)}
                    color="success"
                  >
                    <AcceptIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRejectCandidate(candidate._id)}
                    color="error"
                  >
                    <RejectIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveCandidate(candidate._id)}
                    color="default"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCandidates;
