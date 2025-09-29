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
          bgcolor: '#2a475e',
          input: { color: '#c7d5e0' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#66c0f4' },
          },
        }}
      />
      <Button type="submit" variant="contained" size="small" sx={{ bgcolor: '#66c0f4', color: '#fff' }}>
        Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
