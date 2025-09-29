import React from 'react';
import { Box, Typography } from '@mui/material';

const CommentItem = ({ comment }) => {
  return (
    <Box sx={{ bgcolor: '#2a475e', borderRadius: 1, p: 1, mb: 1 }}>
      <Typography sx={{ color: '#66c0f4', fontWeight: 'bold', fontSize: '0.9rem' }}>
        {comment.user?.name || 'Unknown'}
      </Typography>
      <Typography sx={{ color: '#c7d5e0', fontSize: '0.9rem' }}>{comment.text}</Typography>
      <Typography sx={{ color: '#8f98a0', fontSize: '0.8rem' }}>
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CommentItem;
