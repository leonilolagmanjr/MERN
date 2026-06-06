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
      <IconButton 
        color="inherit" 
        onClick={handleMenuOpen}
        sx={{
          color: '#DCD7C9',
          '&:hover': {
            bgcolor: 'rgba(162, 123, 92, 0.1)'
          }
        }}
      >
        <Badge 
          badgeContent={friendRequests.length} 
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#A27B5C',
              color: '#2C3639',
              fontWeight: 'bold'
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            bgcolor: '#3F4E4F', 
            color: '#DCD7C9', 
            width: 350,
            maxHeight: 400,
            overflow: 'auto',
            border: '2px solid rgba(162, 123, 92, 0.3)',
            borderRadius: '8px',
            mt: 1
          },
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            px: 2, 
            py: 1.5, 
            borderBottom: '1px solid rgba(162, 123, 92, 0.3)',
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          Friend Requests
        </Typography>
        {friendRequests.length === 0 ? (
          <MenuItem 
            disabled
            sx={{
              '&.Mui-disabled': {
                opacity: 1
              }
            }}
          >
            <Typography sx={{ 
              fontStyle: 'italic',
              color: 'rgba(220, 215, 201, 0.7)',
              py: 1
            }}>
              No new friend requests
            </Typography>
          </MenuItem>
        ) : (
          friendRequests.map((req) => (
            <MenuItem 
              key={req._id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                borderBottom: '1px solid rgba(162, 123, 92, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(162, 123, 92, 0.1)'
                },
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <Box sx={{ flex: 1, mr: 1 }}>
                <UserLink 
                  userId={req._id} 
                  name={req.name} 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#DCD7C9'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(220, 215, 201, 0.7)',
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}
                >
                  {req.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#4caf50',
                    color: '#2C3639',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.5,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: '#388e3c',
                      transform: 'translateY(-1px)'
                    }
                  }}
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#ff6b6b',
                    color: '#2C3639',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.5,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: '#ff5252',
                      transform: 'translateY(-1px)'
                    }
                  }}
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