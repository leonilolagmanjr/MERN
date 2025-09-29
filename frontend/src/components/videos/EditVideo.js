import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updateVideo } from '../../services/api';

const EditVideo = ({ video, onVideoUpdated, onClose }) => {
  const [title, setTitle] = useState(video.title || '');
  const [description, setDescription] = useState(video.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updateData = { title, description };
      await updateVideo(video._id, updateData, token);
      onVideoUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating video:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Edit Video</Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Update</Button>
      </Box>
    </Box>
  );
};

export default EditVideo;
