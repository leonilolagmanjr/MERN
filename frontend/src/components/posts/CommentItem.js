import React from 'react';
import { Box, Typography } from '@mui/material';
import UserLink from '../UserLink';

const CommentItem = ({ comment }) => {
  return (
    <Box sx={{ bgcolor: 'var(--color-button-bg)', borderRadius: 'var(--radius)', p: 1, mb: 1 }}>
      <UserLink userId={comment.user?._id} name={comment.user?.name} sx={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
      <Typography sx={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>{comment.text}</Typography>
      <Typography sx={{ color: 'var(--color-text-gray)', fontSize: '0.8rem' }}>
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CommentItem;
