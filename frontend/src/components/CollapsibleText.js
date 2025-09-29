import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';

const CollapsibleText = ({ text, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <Typography variant="body2" sx={{ mt: 1 }}>{text}</Typography>;
  }

  return (
    <div>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </Typography>
      <Button onClick={() => setIsExpanded(!isExpanded)} size="small">
        {isExpanded ? 'Read less' : 'Read more'}
      </Button>
    </div>
  );
};

export default CollapsibleText;
