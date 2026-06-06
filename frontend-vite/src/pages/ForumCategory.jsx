import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Modal, 
  Card, 
  CardContent,
  Container,
  Avatar,
  IconButton,
  Breadcrumbs,
  Chip,
  CircularProgress
} from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import Posts from '../components/posts/Posts';
import { fetchForumGroups } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const ForumCategory = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        const groups = await fetchForumGroups();
        const foundGroup = groups.find(g => g._id === groupId);
        setGroup(foundGroup);
      } catch (err) {
        console.error('Error fetching forum group:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [groupId]);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#2C3639'
      }}>
        <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#2C3639',
        color: '#DCD7C9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <GroupsIcon sx={{ fontSize: '4rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
            <Typography variant="h4" sx={{ color: '#DCD7C9', mb: 2 }}>
              Group Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 400, mx: 'auto' }}>
              The forum group you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/forum"
              startIcon={<ArrowBackIcon />}
              sx={{
                bgcolor: '#A27B5C',
                color: '#2C3639',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#8a6a50',
                }
              }}
            >
              Back to Forum
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

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
          radial-gradient(circle at 15% 15%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 85% 85%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs 
          separator={<NavigateNextIcon sx={{ color: '#A27B5C' }} />} 
          sx={{ mb: 4, '& .MuiBreadcrumbs-li': { color: 'rgba(220, 215, 201, 0.7)' } }}
        >
          <Link to="/forum" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#A27B5C', '&:hover': { color: '#DCD7C9' } }}>
              Forum
            </Typography>
          </Link>
          <Typography sx={{ color: '#DCD7C9', fontWeight: 'bold' }}>
            {group.name}
          </Typography>
        </Breadcrumbs>

        {/* Group Header */}
        <Card sx={{ 
          bgcolor: '#3F4E4F',
          border: '2px solid #A27B5C',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(162, 123, 92, 0.2)',
          mb: 6,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#A27B5C', 
                  width: 70, 
                  height: 70,
                  border: '3px solid rgba(162, 123, 92, 0.5)',
                  fontSize: '1.8rem',
                  fontWeight: 'bold'
                }}
              >
                {group.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 1 }}>
                  {group.name}
                </Typography>
                <Typography variant="h6" sx={{ color: '#A27B5C', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ForumIcon /> Discussion Group
                </Typography>
              </Box>
            </Box>
            
            <Typography sx={{ 
              color: 'rgba(220, 215, 201, 0.8)', 
              fontSize: '1.1rem',
              lineHeight: 1.7,
              mb: 3,
              pl: { xs: 0, sm: 9 }
            }}>
              {group.description}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              pt: 2,
              borderTop: '2px solid rgba(162, 123, 92, 0.3)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: '#2C3639',
                    border: '1px solid #A27B5C'
                  }}
                >
                  {group.createdBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                  Created by {group.createdBy?.name || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/forum"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    bgcolor: 'transparent',
                    color: '#A27B5C',
                    border: '2px solid #A27B5C',
                    px: 3,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderColor: '#8a6a50',
                    }
                  }}
                >
                  Back to Forum
                </Button>
                
                {user && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreate(true)}
                    sx={{
                      bgcolor: '#A27B5C',
                      color: '#2C3639',
                      px: 4,
                      fontWeight: 'bold',
                      border: '2px solid #A27B5C',
                      '&:hover': {
                        bgcolor: '#8a6a50',
                        borderColor: '#8a6a50',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                      }
                    }}
                  >
                    Create Thread
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Threads Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: '#DCD7C9', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <ForumIcon sx={{ color: '#A27B5C' }} />
            Discussion Threads
            <Chip 
              label="Active" 
              sx={{ 
                bgcolor: 'rgba(162, 123, 92, 0.2)', 
                color: '#DCD7C9',
                fontWeight: 'bold'
              }} 
            />
          </Typography>
        </Box>

        {/* Posts Component */}
        <Box sx={{ 
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Posts refreshTrigger={refreshPosts} type="thread" groupId={groupId} />
        </Box>

        {/* Create Thread Modal */}
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
            minWidth: { xs: '90%', sm: 600 },
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#DCD7C9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AddIcon /> Create New Thread
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
              onPostCreated={() => { 
                setOpenCreate(false); 
                triggerRefresh(); 
              }}
              type="thread"
              groupId={groupId}
            />
            
            <Box sx={{ mt: 4, pt: 3, borderTop: '2px solid rgba(162, 123, 92, 0.3)' }}>
              <Button 
                onClick={() => setOpenCreate(false)} 
                variant="outlined"
                fullWidth
                sx={{ 
                  color: '#A27B5C',
                  borderColor: '#A27B5C',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)',
                    borderColor: '#8a6a50',
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Bottom Navigation */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="text"
            component={Link}
            to="/forum"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#A27B5C',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                color: '#DCD7C9',
                bgcolor: 'transparent',
              }
            }}
          >
            Return to Forum Overview
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ForumCategory;