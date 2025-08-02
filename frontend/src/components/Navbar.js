import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#171a21', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            PBuild
          </Typography>
          <Box display="flex" gap={2}>
            <Button component={Link} to="/" sx={{ color: '#c7d5e0' }}>
              Home
            </Button>
            <Button component={Link} to="/browse" sx={{ color: '#c7d5e0' }}>
              Browse
            </Button>
            <Button component={Link} to="/about" sx={{ color: '#c7d5e0' }}>
              About
            </Button>
            <Button component={Link} to="/taskmanager" sx={{ color: '#c7d5e0' }}>
              Task Manager
            </Button>
            <Button component={Link} to="/editprofile" sx={{ color: '#c7d5e0' }}>
              Edit Profile
            </Button>
          </Box>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {isLoggedIn ? (
            <>
              <Notification />
              <Button
                component={Link}
                to={`/profile/${user?.id}`}
                sx={{ color: '#66c0f4', textTransform: 'none' }}
              >
                {user?.name}'s Profile
              </Button>
              <Button
                onClick={handleLogout}
                sx={{ color: '#ff4c4c', textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} to="/auth" sx={{ color: '#66c0f4' }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
