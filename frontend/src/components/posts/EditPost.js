import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updatePost } from '../../services/api';

const EditPost = ({ post, onPostUpdated, onCancel }) => {
  const [content, setContent] = useState(post.content);
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
      await updatePost(post._id, formData, token);
      onPostUpdated();
      onCancel();
    } catch (err) {
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Edit your post"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        sx={{
          bgcolor: 'var(--color-card-bg)',
          input: { color: 'var(--color-text)' },
          '& .MuiInputLabel-root': { color: 'var(--color-text)' },
          '& .MuiOutlinedInput-root': { color: 'var(--color-text)'},
          '& fieldset': { borderColor: 'var(--color-primary)' },
        }}
      />
      {post.media && post.media.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {post.media.map((mediaItem, idx) => {
            const isVideo = mediaItem.url.match(/\.(mp4|webm|ogg)$/i);
            return isVideo ? (
              <video key={idx} src={mediaItem.url} controls style={{ width: '100%', borderRadius: 'var(--radius)' }} />
            ) : (
              <img key={idx} src={mediaItem.url} alt="current media" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius)' }} />
            );
          })}
          <Typography sx={{ color: 'var(--color-text-gray)', fontSize: '0.8rem' }}>
            Current media:
          </Typography>
          {post.media.map((mediaItem, idx) => (
            <Typography key={idx} sx={{ color: 'var(--color-text)', fontSize: '0.8rem' }}>
              {mediaItem.url.split('/').pop()}
            </Typography>
          ))}
        </Box>
      )}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ color: 'var(--color-text)' }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }}
          disabled={loading || !content.trim()}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ color: 'var(--color-text)', borderColor: 'var(--color-primary)' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPost;
