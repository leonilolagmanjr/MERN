import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PostItem from './PostItem';
import { fetchPosts, fetchUserPosts } from '../../services/api';

const Posts = ({ refreshTrigger, userId }) => {
  const [posts, setPosts] = useState([]);
  const [internalRefresh, setInternalRefresh] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        let data;
        const token = localStorage.getItem('token');
        if (userId) {
          data = await fetchUserPosts(userId, token);
        } else {
          data = await fetchPosts();
        }
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    loadPosts();
  }, [refreshTrigger, internalRefresh, userId]);

  const handlePostUpdated = () => {
    setInternalRefresh(prev => prev + 1);
  };

  return (
    <Box>
      {posts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#8f98a0' }}>No posts yet. Be the first to post!</Typography>
      ) : (
        posts.map((post) => (
          <PostItem key={post._id} post={post} onPostUpdated={handlePostUpdated} />
        ))
      )}
    </Box>
  );
};

export default Posts;
