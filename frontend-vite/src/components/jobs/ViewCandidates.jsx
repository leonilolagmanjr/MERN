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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: '#3F4E4F',
          color: '#DCD7C9',
          borderRadius: '8px',
          border: '2px solid rgba(162, 123, 92, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#2C3639', 
        color: '#DCD7C9',
        borderBottom: '2px solid #A27B5C',
        fontSize: '1.25rem',
        fontWeight: 600,
      }}>
        Candidates for "{jobTitle}"
      </DialogTitle>
      <DialogContent sx={{ 
        bgcolor: '#3F4E4F', 
        color: '#DCD7C9',
        padding: '16px 24px',
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress sx={{ color: '#A27B5C' }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error"
            sx={{
              bgcolor: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              '& .MuiAlert-icon': {
                color: '#dc3545',
              }
            }}
          >
            {error}
          </Alert>
        ) : candidates.length === 0 ? (
          <Typography 
            sx={{ 
              color: '#A27B5C',
              textAlign: 'center',
              padding: '20px',
              fontStyle: 'italic'
            }}
          >
            No candidates have applied for this job yet.
          </Typography>
        ) : (
          <List sx={{ padding: 0 }}>
            {candidates.map((candidate) => (
              <ListItem 
                key={candidate._id}
                sx={{
                  borderBottom: '1px solid rgba(162, 123, 92, 0.2)',
                  padding: '12px 0',
                  '&:last-child': {
                    borderBottom: 'none',
                  }
                }}
              >
                <ListItemText
                  primary={
                    <UserLink 
                      userId={candidate._id} 
                      name={candidate.name} 
                      style={{ color: '#DCD7C9', fontWeight: 600 }}
                    />
                  }
                  secondary={
                    <Typography sx={{ 
                      color: 'rgba(220, 215, 201, 0.8)',
                      fontSize: '0.875rem'
                    }}>
                      {candidate.email}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleAcceptCandidate(candidate._id)}
                    sx={{ 
                      color: '#28a745',
                      '&:hover': {
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      }
                    }}
                  >
                    <AcceptIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRejectCandidate(candidate._id)}
                    sx={{ 
                      color: '#dc3545',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                      }
                    }}
                  >
                    <RejectIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveCandidate(candidate._id)}
                    sx={{ 
                      color: '#A27B5C',
                      '&:hover': {
                        backgroundColor: 'rgba(162, 123, 92, 0.1)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        bgcolor: '#3F4E4F',
        borderTop: '2px solid rgba(162, 123, 92, 0.3)',
        padding: '16px 24px',
      }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#DCD7C9',
            border: '2px solid #A27B5C',
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#A27B5C',
              color: '#2C3639',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)',
              borderColor: '#8a6a50',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCandidates;