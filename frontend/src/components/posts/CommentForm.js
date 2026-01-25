import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <TextField
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        size="small"
        sx={{
          bgcolor: '#3F4E4F',
          input: { color: '#DCD7C9' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#A27B5C' },
          },
        }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        size="small" 
        sx={{ 
          bgcolor: '#A27B5C', 
          color: '#2C3639',
          '&:hover': {
            bgcolor: '#8a6a50',
          }
        }}
      >
        Comment
      </Button>
    </Box>
  );
};

export default CommentForm;