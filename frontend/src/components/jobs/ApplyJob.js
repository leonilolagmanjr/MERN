import React, { useState, useCallback } from 'react';
import { Button, Alert, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { applyToJob } from '../../services/api';

// Constants for better maintainability
const MESSAGE_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning'
};

const JOB_STATUS = {
  OPEN: 'open'
};

const ApplyJob = ({ job, onApplySuccess }) => {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState(MESSAGE_TYPES.SUCCESS);

  // Clear message helper
  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  // Show message helper
  const showMessage = useCallback((text, type = MESSAGE_TYPES.ERROR) => {
    setMessage(text);
    setSeverity(type);
  }, []);

  // Validation checks
  const validateApplication = useCallback(() => {
    if (!isLoggedIn) {
      showMessage('Please log in to apply for jobs.', MESSAGE_TYPES.ERROR);
      return false;
    }

    if (user._id === job.createdBy._id.toString()) {
      showMessage('You cannot apply to your own job.', MESSAGE_TYPES.ERROR);
      return false;
    }

    if (job.candidates?.some(id => id.toString() === user._id)) {
      showMessage('You have already applied to this job.', MESSAGE_TYPES.INFO);
      return false;
    }

    if (job.status !== JOB_STATUS.OPEN) {
      showMessage('This job is no longer accepting applications.', MESSAGE_TYPES.ERROR);
      return false;
    }

    return true;
  }, [isLoggedIn, user, job, showMessage]);

  const handleApply = async () => {
    // Clear previous messages
    clearMessage();

    // Validate application
    if (!validateApplication()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await applyToJob(job._id, token);
      showMessage('Successfully applied to the job!', MESSAGE_TYPES.SUCCESS);
      
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg 
        || error.message 
        || 'Failed to apply to the job. Please try again.';
      
      showMessage(errorMessage, MESSAGE_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = loading || job.status !== JOB_STATUS.OPEN;

  // Auto-hide success message after 5 seconds
  React.useEffect(() => {
    if (severity === MESSAGE_TYPES.SUCCESS && message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [severity, message, clearMessage]);

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApply}
        disabled={isButtonDisabled}
        sx={{ 
          mt: 2,
          width: '100%',
          minHeight: '48px' // Better touch target
        }}
        aria-label={loading ? 'Applying to job' : 'Apply to job'}
        aria-live="polite"
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'inherit' }} />
        ) : (
          'Apply to Job'
        )}
      </Button>
      
      {message && (
        <Alert 
          severity={severity} 
          sx={{ 
            mt: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          onClose={clearMessage}
          role="alert"
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default ApplyJob;