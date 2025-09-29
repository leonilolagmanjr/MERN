import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import PostItem from '../components/posts/PostItem';
import { fetchPosts } from '../services/api';

const SocialMedia = () => {
  const [posts, setPosts] = useState([]);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    loadPosts();
  }, [refreshPosts]);

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
          Social Media Feed
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="contained" sx={{ bgcolor: '#66c0f4', color: '#fff' }} onClick={() => setOpenCreate(true)}>
            Create Post
          </Button>
        </Box>

        <Box>
          {posts.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#8f98a0' }}>No posts yet. Be the first to post!</Typography>
          ) : (
            posts.map((post) => (
              <PostItem key={post._id} post={post} onPostUpdated={triggerRefresh} />
            ))
          )}
        </Box>

        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#23262e', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: '#66c0f4', mb: 2 }}>Create Post</Typography>
            <CreatePost onPostCreated={() => { setOpenCreate(false); triggerRefresh(); }} />
            <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: '#fff', bgcolor: '#ff4c4c' }}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default SocialMedia;
