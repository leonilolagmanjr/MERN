import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';
import UserLink from './UserLink';
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
    //{ text: 'Videos', to: '/videos' },
    //{ text: 'Video Manager', to: '/videomanager' },
    //{ text: 'Task Manager', to: '/taskmanager' },
    { text: 'Social', to: '/social' },
    { text: 'Forum', to: '/forum' },
    //{ text: 'Payments', to: '/payments' },
    //{ text: 'Transactions', to: '/transactions' },
    //{ text: 'Trade', to: '/trade' },
    //{ text: 'Verification', to: '/verification' },
    //{ text: 'Edit Profile', to: '/editprofile' },
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
              <ListItemText primary="Logout" sx={{ color: 'var(--color-error)' }} />
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
    <AppBar position="static" sx={{ bgcolor: 'var(--color-header-bg)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', color: 'var(--color-text)', textDecoration: 'none' }}>
            PBuild
          </Typography>
          {!isMobile && (
            <Box display="flex" gap={2}>
              {menuItems.map((item) => (
                <Button component={Link} to={item.to} sx={{ color: 'var(--color-text)' }} key={item.text}>
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
                  <UserLink userId={user?.id} name={user?.name} sx={{ textTransform: 'none' }} />
                  <Button
                    onClick={handleLogout}
                    sx={{ color: 'var(--color-error)', textTransform: 'none' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button component={Link} to="/auth" sx={{ color: 'var(--color-primary)' }}>
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
