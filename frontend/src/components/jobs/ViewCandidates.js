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
import { Delete as DeleteIcon } from '@mui/icons-material';
import { fetchCandidates, removeCandidate } from '../../services/api';

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
                  primary={candidate.name}
                  secondary={candidate.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveCandidate(candidate._id)}
                    color="error"
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
