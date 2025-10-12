import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const UserLink = ({ userId, name, sx = {} }) => {
  const { user } = useAuth();
  const isOwn = userId === user?.id;
  const displayName = isOwn ? name : name || 'Unknown';

  if (!userId) {
    return (
      <Typography
        component="span"
        sx={{ color: 'var(--color-primary)', display: 'inline', ...sx }}
      >
        {displayName}
      </Typography>
    );
  }

  return (
    <Link
      to={`/profile/${userId}`}
      style={{ textDecoration: 'none', display: 'inline-block' }}
    >
      <Typography
        component="span"
        sx={{
          color: 'var(--color-primary)',
          display: 'inline',
          '&:hover': { textDecoration: 'underline' },
          ...sx,
        }}
      >
        {displayName}
      </Typography>
    </Link>
  );
};

export default UserLink;
