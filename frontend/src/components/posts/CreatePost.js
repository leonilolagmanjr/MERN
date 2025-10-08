import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { createPost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreatePost = ({ onPostCreated, type = 'post', category, groupId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setMedia(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      for (let i = 0; i < media.length; i++) {
        formData.append('media', media[i]);
      }
      if (type) formData.append('type', type);
      if (category) formData.append('category', category);
      if (groupId) formData.append('groupId', groupId);

      await createPost(formData, token);
      setContent('');
      setMedia([]);
      onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="What's on your mind?"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        sx={{
          bgcolor: '#2a475e',
          input: { color: '#c7d5e0' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#66c0f4' },
          },
        }}
      />
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ color: '#c7d5e0' }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ bgcolor: '#66c0f4', color: '#fff' }}
        disabled={loading || !content.trim()}
      >
        {loading ? 'Posting...' : 'Post'}
      </Button>
    </Box>
  );
};

export default CreatePost;
