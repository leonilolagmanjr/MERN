import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PostItem from './PostItem';
import { fetchPosts, fetchUserPosts } from '../../services/api';

const Posts = ({ refreshTrigger, userId, type, category, groupId, onPostUpdate }) => {
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
          const params = {};
          if (type) params.type = type;
          if (category) params.category = category;
          if (groupId) params.groupId = groupId;
          data = await fetchPosts(params);
        }
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    loadPosts();
  }, [refreshTrigger, internalRefresh, userId, type, category, groupId]);

  const handlePostUpdated = () => {
    setInternalRefresh(prev => prev + 1);
    if (onPostUpdate) onPostUpdate();
  };

  return (
    <Box>
      {posts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No posts yet. Be the first to post!</Typography>
      ) : (
        posts.map((post) => (
          <PostItem key={post._id} post={post} onPostUpdated={handlePostUpdated} />
        ))
      )}
    </Box>
  );
};

export default Posts;
