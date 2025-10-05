import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const UserLink = ({ userId, name, sx = {} }) => {
  const { user } = useAuth();
  const isOwn = userId === user?.id;
  const displayName = isOwn ? name : name || 'Unknown';

  if (!userId) {
    return <Typography sx={{ color: '#66c0f4', ...sx }}>{displayName}</Typography>;
  }

  return (
    <Link to={`/profile/${userId}`} style={{ textDecoration: 'none' }}>
      <Typography sx={{ color: '#66c0f4', '&:hover': { textDecoration: 'underline' }, ...sx }}>
        {displayName}
      </Typography>
    </Link>
  );
};

export default UserLink;
