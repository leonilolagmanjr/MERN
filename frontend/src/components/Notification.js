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
          sx: { bgcolor: '#171a21', color: '#c7d5e0', width: 300 },
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1, borderBottom: '1px solid #3a3f4b' }}>
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
                <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                  {req.email}
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: '#4CAF50', mr: 1 }}
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: '#ff4c4c' }}
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
