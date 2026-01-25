import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Modal, 
  Container,
  TextField,
  Avatar,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { fetchForumGroups, createForumGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ForumIcon from '@mui/icons-material/Forum';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const Forum = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await createForumGroup({ name, description }, token);
      setName('');
      setDescription('');
      setOpenCreate(false);
      // Reload groups
      const data = await fetchForumGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error creating forum group:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          radial-gradient(circle at 20% 30%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 80% 70%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#DCD7C9',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <ForumIcon sx={{ fontSize: '2.5rem', color: '#A27B5C' }} />
            Community Forum
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#A27B5C',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Join discussions, share knowledge, and connect with other professionals
          </Typography>
        </Box>

        {/* Search and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 5,
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}>
          <TextField
            placeholder="Search forum groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#3F4E4F',
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
              },
              '& .MuiOutlinedInput-input': {
                color: '#DCD7C9',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              }
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#A27B5C', mr: 1 }} />
              ),
            }}
          />
          
          {user && (
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
                minWidth: { xs: '100%', md: 'auto' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#8a6a50',
                  borderColor: '#8a6a50',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                },
              }}
            >
              Create New Group
            </Button>
          )}
        </Box>

        {/* Groups Count */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#DCD7C9',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <GroupsIcon sx={{ color: '#A27B5C' }} />
          {filteredGroups.length} Group{filteredGroups.length !== 1 ? 's' : ''} Available
        </Typography>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
            {filteredGroups.map((group) => (
              <Card 
                key={group._id} 
                sx={{ 
                  bgcolor: '#3F4E4F', 
                  color: '#DCD7C9',
                  borderRadius: 3,
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(162, 123, 92, 0.3)',
                    borderColor: '#A27B5C',
                  },
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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#A27B5C', 
                        width: 50, 
                        height: 50,
                        border: '2px solid rgba(162, 123, 92, 0.5)'
                      }}
                    >
                      {group.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Link 
                        to={`/forum/${group._id}`} 
                        style={{ 
                          textDecoration: 'none',
                          display: 'block'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#DCD7C9',
                            fontWeight: 'bold',
                            mb: 0.5,
                            '&:hover': {
                              color: '#A27B5C',
                            }
                          }}
                        >
                          {group.name}
                        </Typography>
                      </Link>
                      <Typography 
                        sx={{ 
                          color: 'rgba(220, 215, 201, 0.7)',
                          fontSize: '0.9rem',
                          mb: 2
                        }}
                      >
                        {group.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                        Created by {group.createdBy?.name || 'Unknown'}
                      </Typography>
                    </Box>
                    
                    <Link to={`/forum/${group._id}`}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          color: '#A27B5C',
                          borderColor: '#A27B5C',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: 'rgba(162, 123, 92, 0.1)',
                            borderColor: '#8a6a50',
                          }
                        }}
                      >
                        View Group
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10,
            bgcolor: 'rgba(63, 78, 79, 0.3)',
            borderRadius: 3,
            border: '2px dashed #A27B5C'
          }}>
            <GroupsIcon sx={{ fontSize: '4rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#DCD7C9', mb: 2 }}>
              No groups found
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? `No groups matching "${searchTerm}"` : 'No forum groups available yet'}
            </Typography>
            {user && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreate(true)}
                sx={{ 
                  mt: 3,
                  bgcolor: '#A27B5C', 
                  color: '#2C3639',
                  '&:hover': {
                    bgcolor: '#8a6a50',
                  }
                }}
              >
                Create First Group
              </Button>
            )}
          </Box>
        )}

        {/* Create Group Modal */}
        <Modal open={openCreate} onClose={() => !loading && setOpenCreate(false)}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon /> Create New Group
              </Typography>
              <IconButton 
                onClick={() => setOpenCreate(false)} 
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
            
            <form onSubmit={handleCreateGroup}>
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
                  onClick={() => setOpenCreate(false)} 
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
            </form>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Forum;