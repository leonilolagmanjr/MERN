import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Modal } from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import Posts from '../components/posts/Posts';
import { useAuth } from '../context/AuthContext';

const SocialMedia = () => {
  const { isLoggedIn } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
          Social Media Feed
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          {isLoggedIn && (
            <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} onClick={() => setOpenCreate(true)}>
              Create Post
            </Button>
          )}
          <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} component={Link} to="/videos">
            View Videos
          </Button>
        </Box>

        <Posts refreshTrigger={refreshPosts} type="post" />

        {isLoggedIn && (
          <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 'var(--radius)', boxShadow: 24, minWidth: 400 }}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>Create Post</Typography>
              <CreatePost onPostCreated={() => { setOpenCreate(false); triggerRefresh(); }} />
              <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: 'var(--color-text)', bgcolor: 'var(--color-error)' }}>Close</Button>
            </Box>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default SocialMedia;
