import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { deleteVideo } from '../../services/api';

const DeleteVideo = ({ video, onVideoDeleted, onClose }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteVideo(video._id, token);
      onVideoDeleted();
      onClose();
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Delete Video</Typography>
      <Typography>Are you sure you want to delete "{video.title}"?</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
      </Box>
    </Box>
  );
};

export default DeleteVideo;
