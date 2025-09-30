import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', to: '/' },
    { text: 'Browse', to: '/browse' },
    { text: 'About', to: '/about' },
    { text: 'Videos', to: '/videos' },
    //{ text: 'Video Manager', to: '/videomanager' },
    { text: 'Task Manager', to: '/taskmanager' },
    { text: 'Social', to: '/social' },
    { text: 'Edit Profile', to: '/editprofile' },
  ];

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button component={Link} to={item.to} key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isLoggedIn ? (
          <>
            <ListItem button component={Link} to={`/profile/${user?.id}`}>
              <ListItemText primary={`${user?.name}'s Profile`} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: '#ff4c4c' }} />
            </ListItem>
          </>
        ) : (
          <ListItem button component={Link} to="/auth">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#171a21', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', color: '#ffffff', textDecoration: 'none' }}>
            PBuild
          </Typography>
          {!isMobile && (
            <Box display="flex" gap={2}>
              {menuItems.map((item) => (
                <Button component={Link} to={item.to} sx={{ color: '#c7d5e0' }} key={item.text}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerList}
              </Drawer>
            </>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
