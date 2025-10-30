import React, { useState, useContext } from 'react';
import { acceptFriendRequest, denyFriendRequest } from '../services/api';
import { FriendContext } from '../context/FriendContext';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserLink from './UserLink';

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { friendRequests, notifyFriendListUpdated } = useContext(FriendContext);

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(requesterId, token);
      notifyFriendListUpdated();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  const handleDeny = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await denyFriendRequest(requesterId, token);
      notifyFriendListUpdated();
    } catch (err) {
      console.error('Error denying friend request:', err);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={friendRequests.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)', width: 300 },
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1, borderBottom: '1px solid var(--color-border)' }}>
          Friend Requests
        </Typography>
        {friendRequests.length === 0 ? (
          <MenuItem disabled>
            <Typography sx={{ fontStyle: 'italic' }}>No new friend requests</Typography>
          </MenuItem>
        ) : (
          friendRequests.map((req) => (
            <MenuItem key={req._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <UserLink userId={req._id} name={req.name} />
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                  {req.email}
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: 'var(--color-success)', mr: 1 }}
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: 'var(--color-error)' }}
                  onClick={() => handleDeny(req._id)}
                >
                  Deny
                </Button>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default Notification;
