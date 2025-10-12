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
          bgcolor: 'var(--color-card-bg)',
          input: { color: 'var(--color-text)' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'var(--color-primary)' },
          },
        }}
      />
      <Button type="submit" variant="contained" size="small" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
        Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
