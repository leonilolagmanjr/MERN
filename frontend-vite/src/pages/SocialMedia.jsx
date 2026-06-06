import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Modal, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Container,
  Grid,
  Chip,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import Posts from '../components/posts/Posts';
import { fetchForumGroups, createForumGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import FeedIcon from '@mui/icons-material/Feed';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';

const SocialMedia = () => {
  const { isLoggedIn, user } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateForum, setOpenCreateForum] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // null for social feed, groupId for forum

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchForumGroups();
        setGroups(data);
      } catch (err) {
        console.error('Error fetching forum groups:', err);
      }
    };
    loadGroups();
  }, []);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleBackToSocial = () => {
    setSelectedGroup(null);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await createForumGroup({ name, description }, token);
      setName('');
      setDescription('');
      setOpenCreateForum(false);
      // Reload groups
      const data = await fetchForumGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error creating forum group:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedGroupData = groups.find(g => g._id === selectedGroup);

  return (
    <Box sx={{ 
      bgcolor: '#2C3639', 
      color: '#DCD7C9', 
      minHeight: '100vh',
      py: 5,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(162, 123, 92, 0.05) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(63, 78, 79, 0.08) 0%, transparent 20%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Left Sidebar - Forum Groups */}
          <Grid item xs={12} lg={3}>
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                position: 'sticky',
                top: 20,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <GroupsIcon sx={{ color: '#A27B5C' }} />
                    Forum Groups
                    <Chip 
                      label={groups.length} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(162, 123, 92, 0.2)', 
                        color: '#DCD7C9',
                        fontWeight: 'bold',
                        ml: 1
                      }} 
                    />
                  </Typography>
                  
                  {isLoggedIn && (
                    <IconButton
                      size="small"
                      onClick={() => setOpenCreateForum(true)}
                      sx={{
                        color: '#A27B5C',
                        border: '1px solid #A27B5C',
                        '&:hover': {
                          bgcolor: 'rgba(162, 123, 92, 0.1)',
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Box>
                
                <List sx={{ mb: 2 }}>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={selectedGroup === null}
                      onClick={handleBackToSocial}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        '&.Mui-selected': { 
                          bgcolor: '#A27B5C',
                          color: '#2C3639',
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: '#8a6a50',
                          }
                        },
                        '&:hover': { 
                          bgcolor: 'rgba(162, 123, 92, 0.1)',
                          color: '#DCD7C9'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FeedIcon />
                            Social Feed
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)', my: 2 }} />
                  
                  {groups.slice(0, 8).map((group) => (
                    <ListItem key={group._id} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        selected={selectedGroup === group._id}
                        onClick={() => handleGroupSelect(group._id)}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          '&.Mui-selected': { 
                            bgcolor: '#A27B5C',
                            color: '#2C3639',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: '#8a6a50',
                            }
                          },
                          '&:hover': { 
                            bgcolor: 'rgba(162, 123, 92, 0.1)',
                            color: '#DCD7C9'
                          }
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <ForumIcon sx={{ fontSize: '1.2rem' }} />
                              {group.name}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.6)', ml: 4 }}>
                              {group.createdBy?.name || 'Unknown'}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                
                {groups.length > 8 && (
                  <Button
                    component={Link}
                    to="/forum"
                    fullWidth
                    sx={{
                      color: '#A27B5C',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: 'rgba(162, 123, 92, 0.1)',
                      }
                    }}
                  >
                    View All Groups →
                  </Button>
                )}
              </CardContent>
            </Paper>

            {/* Trending Topics */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                mt: 4,
                p: 3
              }}
            >
              <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#A27B5C' }} />
                Trending Topics
              </Typography>
              
              <List>
                {['Web Development', 'Freelance Tips', 'Remote Work', 'Career Growth'].map((topic, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton sx={{ 
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { 
                        bgcolor: 'rgba(162, 123, 92, 0.1)',
                      }
                    }}>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <WhatshotIcon sx={{ color: '#A27B5C', fontSize: '1.2rem' }} />
                            {topic}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} lg={6}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h3" sx={{ 
                color: '#DCD7C9', 
                mb: 2,
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                {selectedGroup ? (
                  <>
                    <ForumIcon sx={{ fontSize: '2.5rem', color: '#A27B5C' }} />
                    {selectedGroupData?.name}
                  </>
                ) : (
                  <>
                    <FeedIcon sx={{ fontSize: '2.5rem', color: '#A27B5C' }} />
                    Social Media Feed
                  </>
                )}
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: '#A27B5C',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                {selectedGroup 
                  ? selectedGroupData?.description || 'Group discussions'
                  : 'Share updates, connect with others, and join conversations'
                }
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {isLoggedIn && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreate(true)}
                    sx={{
                      bgcolor: '#A27B5C',
                      color: '#2C3639',
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      border: '2px solid #A27B5C',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: '#8a6a50',
                        borderColor: '#8a6a50',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                      },
                    }}
                  >
                    {selectedGroup ? 'Create Thread' : 'Create Post'}
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  component={Link}
                  to="/videos"
                  startIcon={<VideoLibraryIcon />}
                  sx={{
                    color: '#A27B5C',
                    borderColor: '#A27B5C',
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderWidth: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderColor: '#8a6a50',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(162, 123, 92, 0.2)',
                    },
                  }}
                >
                  View Videos
                </Button>
              </Box>
            </Box>

            {/* Posts Component */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden'
              }}
            >
              <Posts
                refreshTrigger={refreshPosts}
                type={selectedGroup ? 'thread' : 'post'}
                groupId={selectedGroup}
              />
            </Paper>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} lg={3}>
            {/* User Info Card */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                p: 3,
                mb: 4,
                position: 'sticky',
                top: 20
              }}
            >
              <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PeopleIcon sx={{ color: '#A27B5C' }} />
                Community Stats
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#A27B5C', width: 50, height: 50 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#DCD7C9', fontWeight: 'bold' }}>
                      {user?.name || 'Guest'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                      {isLoggedIn ? 'Active member' : 'Visitor'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)', my: 2 }} />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                      {groups.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                      Groups
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                      1.2K
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                      Active Users
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Button
                component={Link}
                to="/forum"
                variant="contained"
                fullWidth
                startIcon={<ForumIcon />}
                sx={{
                  bgcolor: '#A27B5C',
                  color: '#2C3639',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#8a6a50',
                  }
                }}
              >
                Explore All Groups
              </Button>
            </Paper>

            {/* Recent Activity */}
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                borderRadius: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                p: 3
              }}
            >
              <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ChatBubbleIcon sx={{ color: '#A27B5C' }} />
                Quick Links
              </Typography>
              
              <List>
                {[
                  { text: 'Browse Jobs', path: '/jobs' },
                  { text: 'Post a Job', path: '/post-job' },
                  { text: 'Your Profile', path: `/profile/${user?.id}` },
                  { text: 'Messages', path: '/chat' },
                ].map((link, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      component={Link}
                      to={link.path}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        '&:hover': { 
                          bgcolor: 'rgba(162, 123, 92, 0.1)',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography sx={{ color: '#DCD7C9', fontWeight: 500 }}>
                            {link.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Create Post Modal */}
        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 600 },
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AddIcon /> {selectedGroup ? 'Create Thread' : 'Create Post'}
              </Typography>
              <IconButton 
                onClick={() => setOpenCreate(false)} 
                sx={{ 
                  color: '#A27B5C',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <CreatePost
              onPostCreated={() => { setOpenCreate(false); triggerRefresh(); }}
              type={selectedGroup ? 'thread' : 'post'}
              groupId={selectedGroup}
            />
          </Box>
        </Modal>

        {/* Create Forum Group Modal */}
        <Modal open={openCreateForum} onClose={() => !loading && setOpenCreateForum(false)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 500 },
            maxWidth: 600,
            outline: 'none'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AddIcon /> Create Forum Group
              </Typography>
              <IconButton 
                onClick={() => setOpenCreateForum(false)} 
                disabled={loading}
                sx={{ 
                  color: '#A27B5C',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box component="form" onSubmit={handleCreateGroup}>
              <TextField
                fullWidth
                label="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2C3639',
                    color: '#DCD7C9',
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(162, 123, 92, 0.5)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#A27B5C',
                      boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A27B5C',
                    '&.Mui-focused': {
                      color: '#A27B5C',
                    }
                  }
                }}
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2C3639',
                    color: '#DCD7C9',
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(162, 123, 92, 0.5)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#A27B5C',
                      boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A27B5C',
                    '&.Mui-focused': {
                      color: '#A27B5C',
                    }
                  }
                }}
                required
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  onClick={() => setOpenCreateForum(false)} 
                  variant="outlined"
                  disabled={loading}
                  sx={{ 
                    color: '#A27B5C',
                    borderColor: '#A27B5C',
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderColor: '#8a6a50',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#A27B5C', 
                    color: '#2C3639',
                    px: 5,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#8a6a50',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(162, 123, 92, 0.3)',
                      color: 'rgba(44, 54, 57, 0.5)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#2C3639' }} />
                  ) : (
                    'Create Group'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default SocialMedia;