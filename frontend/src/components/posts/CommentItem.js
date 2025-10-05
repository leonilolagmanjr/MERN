import React from 'react';
import { Box, Typography } from '@mui/material';
import UserLink from '../UserLink';

const CommentItem = ({ comment }) => {
  return (
    <Box sx={{ bgcolor: '#2a475e', borderRadius: 1, p: 1, mb: 1 }}>
      <UserLink userId={comment.user?._id} name={comment.user?.name} sx={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
      <Typography sx={{ color: '#c7d5e0', fontSize: '0.9rem' }}>{comment.text}</Typography>
      <Typography sx={{ color: '#8f98a0', fontSize: '0.8rem' }}>
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CommentItem;
