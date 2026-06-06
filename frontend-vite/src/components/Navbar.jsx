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
    { text: 'Social', to: '/social' },
    { text: 'Forum', to: '/forum' },
  ];

  const drawerList = (
    <Box
      sx={{ 
        width: 250,
        height: '100%',
        bgcolor: '#2C3639'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.to} 
            key={item.text}
            sx={{
              borderBottom: '1px solid rgba(162, 123, 92, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(162, 123, 92, 0.1)'
              }
            }}
          >
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: '#DCD7C9',
                '& .MuiListItemText-primary': {
                  fontWeight: 500
                }
              }} 
            />
          </ListItem>
        ))}
        {isLoggedIn ? (
          <>
            <ListItem 
              button 
              component={Link} 
              to={`/profile/${user?.id}`}
              sx={{
                borderBottom: '1px solid rgba(162, 123, 92, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(162, 123, 92, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary={`${user?.name}'s Profile`} 
                sx={{ 
                  color: '#DCD7C9',
                  '& .MuiListItemText-primary': {
                    fontWeight: 500
                  }
                }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 107, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  color: '#ff6b6b',
                  '& .MuiListItemText-primary': {
                    fontWeight: 500
                  }
                }} 
              />
            </ListItem>
          </>
        ) : (
          <ListItem 
            button 
            component={Link} 
            to="/auth"
            sx={{
              borderTop: '1px solid rgba(162, 123, 92, 0.3)',
              mt: 1,
              '&:hover': {
                bgcolor: 'rgba(162, 123, 92, 0.1)'
              }
            }}
          >
            <ListItemText 
              primary="Login" 
              sx={{ 
                color: '#A27B5C',
                '& .MuiListItemText-primary': {
                  fontWeight: 600
                }
              }} 
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#2C3639', 
        boxShadow: '0 4px 12px rgba(44, 54, 57, 0.8)',
        borderBottom: '2px solid #A27B5C'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#DCD7C9', 
              textDecoration: 'none',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              '&:hover': {
                color: '#A27B5C'
              }
            }}
          >
            PBuild
          </Typography>
          {!isMobile && (
            <Box display="flex" gap={1}>
              {menuItems.map((item) => (
                <Button 
                  component={Link} 
                  to={item.to} 
                  key={item.text}
                  sx={{ 
                    color: '#DCD7C9',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    px: 1.5,
                    '&:hover': {
                      color: '#A27B5C',
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderRadius: '4px'
                    }
                  }}
                >
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
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  color: '#DCD7C9',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    bgcolor: '#2C3639'
                  }
                }}
              >
                {drawerList}
              </Drawer>
            </>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  <Notification />
                  <UserLink 
                    userId={user?.id} 
                    name={user?.name} 
                    sx={{ 
                      color: '#A27B5C',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }} 
                  />
                  <Button
                    onClick={handleLogout}
                    sx={{ 
                      color: '#ff6b6b',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(255, 107, 107, 0.1)',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  component={Link} 
                  to="/auth" 
                  sx={{ 
                    color: '#A27B5C',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '2px solid #A27B5C',
                    borderRadius: '8px',
                    px: 2,
                    '&:hover': {
                      bgcolor: '#A27B5C',
                      color: '#2C3639',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(162, 123, 92, 0.4)'
                    }
                  }}
                >
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