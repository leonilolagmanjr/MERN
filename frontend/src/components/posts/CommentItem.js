import React from 'react';
import { Box, Typography } from '@mui/material';
import UserLink from '../UserLink';

const CommentItem = ({ comment }) => {
  return (
    <Box sx={{ 
      bgcolor: '#3F4E4F', 
      borderRadius: '8px', 
      p: 1, 
      mb: 1,
      border: '1px solid rgba(162, 123, 92, 0.3)'
    }}>
      <UserLink 
        userId={comment.user?._id} 
        name={comment.user?.name} 
        sx={{ 
          fontWeight: 'bold', 
          fontSize: '0.9rem',
          color: '#DCD7C9'
        }} 
      />
      <Typography sx={{ 
        color: '#DCD7C9', 
        fontSize: '0.9rem',
        my: 0.5
      }}>
        {comment.text}
      </Typography>
      <Typography sx={{ 
        color: 'rgba(220, 215, 201, 0.8)', 
        fontSize: '0.8rem',
        fontStyle: 'italic'
      }}>
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CommentItem;