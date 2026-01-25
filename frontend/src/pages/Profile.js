import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Chip,
  Container,
  Divider,
  Card,
  CardContent,
  Stack,
  IconButton,
  LinearProgress,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  fetchPostedJobs,
  fetchCompletedJobs,
  fetchAcceptedJobs,
  getUserProfile,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFriend } from '../context/FriendContext';
import Posts from '../components/posts/Posts';
import FriendActions from '../components/friends/FriendActions';
import UserLink from '../components/UserLink';
import LevelBar from '../components/LevelBar';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFriendStatus, notifyFriendListUpdated, openChatWithUser, friendRequests } = useFriend();

  const [profile, setProfile] = useState({});
  const [postedJobs, setPostedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [requestSent, setRequestSent] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(null);
  const [loadingFriendStatus, setLoadingFriendStatus] = useState(true);
  const [refreshProfile, setRefreshProfile] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const viewedProfile = await getUserProfile(userId, token);

        setProfile(viewedProfile);
        setIsCurrentUser(userId === user?.id);

        const [posted, completed, accepted] = await Promise.all([
          fetchPostedJobs(userId, token),
          fetchCompletedJobs(userId, token),
          fetchAcceptedJobs(userId, token),
        ]);

        setPostedJobs(posted);
        setCompletedJobs(completed);
        setAcceptedJobs(accepted);

        // Always check friend status when profile is visited
        await updateFriendStatus();
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
        setLoadingFriendStatus(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [userId, user, getFriendStatus, refreshProfile]);

  // New function to update friend status
  const updateFriendStatus = async () => {
    try {
      const status = await getFriendStatus(userId);
      setIsFriend(status === 'friends');
      setRequestSent(status === 'requestSent');
      setHasPendingRequest(status === 'requestReceived');

      if (userId === user?.id) {
        const token = localStorage.getItem('token');
        const requests = await getFriendRequests(token);
        setHasPendingRequest(false);
        setRequestSent(false);
        setIsFriend(false);
      }
    } catch (err) {
      console.error('Error updating friend status:', err);
    }
  };

  // Listen for friendRequests or friend list updates to refresh friend status in real time
  useEffect(() => {
    updateFriendStatus();
  }, [friendRequests, userId, user]);

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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Profile Header */}
        <Fade in timeout={600}>
          <Paper
            sx={{
              bgcolor: '#3F4E4F',
              p: 5,
              mb: 6,
              borderRadius: 3,
              border: '2px solid #A27B5C',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
              }
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
                  sx={{
                    width: 180,
                    height: 180,
                    border: '4px solid #A27B5C',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h2" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 1 }}>
                  <UserLink userId={profile._id} name={profile.name} />
                </Typography>
                <Typography variant="h5" sx={{ color: '#A27B5C', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon /> {profile.email || 'No email provided'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<StarIcon />}
                    label={`Level ${profile.level || 1}`} 
                    sx={{ 
                      bgcolor: 'rgba(162, 123, 92, 0.2)', 
                      color: '#DCD7C9',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Chip 
                    label={`${profile.xp || 0} XP`} 
                    sx={{ 
                      bgcolor: 'rgba(162, 123, 92, 0.2)', 
                      color: '#DCD7C9',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Chip 
                    icon={<PeopleIcon />}
                    label={`${profile.connections?.length || 0} Friends`} 
                    sx={{ 
                      bgcolor: 'rgba(162, 123, 92, 0.2)', 
                      color: '#DCD7C9',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Stack spacing={2}>
                  {isCurrentUser && (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/editprofile')}
                      fullWidth
                      sx={{
                        bgcolor: '#A27B5C',
                        color: '#2C3639',
                        py: 1.5,
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#8a6a50',
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                  
                  <FriendActions
                    userId={userId}
                    isCurrentUser={isCurrentUser}
                    isFriend={isFriend}
                    requestSent={requestSent}
                    hasPendingRequest={hasPendingRequest}
                    loadingFriendStatus={loadingFriendStatus}
                    openChatWithUser={openChatWithUser}
                    updateFriendStatus={updateFriendStatus}
                    notifyFriendListUpdated={notifyFriendListUpdated}
                    friendRequests={friendRequests}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Accomplishments Stats */}
            <Fade in timeout={800} delay={200}>
              <Paper
                sx={{
                  bgcolor: '#3F4E4F',
                  p: 4,
                  mb: 4,
                  borderRadius: 3,
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Typography variant="h5" sx={{ color: '#DCD7C9', mb: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmojiEventsIcon /> Accomplishments
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      bgcolor: '#2C3639', 
                      textAlign: 'center',
                      border: '2px solid #A27B5C',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h2" sx={{ color: '#A27B5C', fontWeight: 'bold', mb: 1 }}>
                          {completedJobs.length}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 600 }}>
                          Jobs Completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      bgcolor: '#2C3639', 
                      textAlign: 'center',
                      border: '2px solid #A27B5C',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h2" sx={{ color: '#A27B5C', fontWeight: 'bold', mb: 1 }}>
                          {postedJobs.length}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 600 }}>
                          Jobs Posted
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                      bgcolor: '#2C3639', 
                      textAlign: 'center',
                      border: '2px solid #A27B5C',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h2" sx={{ color: '#A27B5C', fontWeight: 'bold', mb: 1 }}>
                          {profile.xp || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 600 }}>
                          Earned XP
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>

            {/* Recent Activity */}
            {completedJobs.length > 0 && (
              <Fade in timeout={800} delay={400}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TrendingUpIcon /> Recent Activity
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {completedJobs.slice(0, 3).map((job) => (
                      <Grid item xs={12} md={6} key={job._id}>
                        <Card sx={{ 
                          bgcolor: '#2C3639',
                          border: '1px solid rgba(162, 123, 92, 0.3)',
                          borderRadius: 2,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#A27B5C',
                            boxShadow: '0 4px 12px rgba(162, 123, 92, 0.2)',
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 1.5, fontWeight: 'bold' }}>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.8)', mb: 2, fontSize: '0.9rem' }}>
                              {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block' }}>
                              Completed on: {new Date(job.updatedAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Fade>
            )}

            {/* Posts Section */}
            <Fade in timeout={800} delay={600}>
              <Paper
                sx={{
                  bgcolor: '#3F4E4F',
                  p: 4,
                  borderRadius: 3,
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Typography variant="h5" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssessmentIcon /> Posts
                </Typography>
                <Posts userId={userId} onPostUpdate={() => setRefreshProfile(prev => prev + 1)} />
              </Paper>
            </Fade>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Level Progress */}
              <Fade in timeout={800} delay={300}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px solid #A27B5C',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
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
                  <LevelBar xp={profile.xp || 0} level={profile.level || 1} />
                </Paper>
              </Fade>

              {/* Badges */}
              <Fade in timeout={800} delay={400}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BadgeIcon /> Badges & Achievements
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <BadgeIcon sx={{ fontSize: '4rem', color: '#A27B5C', opacity: 0.7, mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 'bold' }}>
                      {profile.badges?.length || 0} Badges Earned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)', mt: 1 }}>
                      Continue completing jobs to earn more badges!
                    </Typography>
                  </Box>
                </Paper>
              </Fade>

              {/* Basic Information */}
              <Fade in timeout={800} delay={500}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WorkIcon /> Basic Information
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationOnIcon sx={{ color: '#A27B5C' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block' }}>
                          Location
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#DCD7C9' }}>
                          {profile.location || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon sx={{ color: '#A27B5C' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block' }}>
                          Phone
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#DCD7C9' }}>
                          {profile.phone || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block', mb: 0.5 }}>
                        Remote Availability
                      </Typography>
                      <Chip 
                        label={profile.remoteAvailability ? 'Available for Remote Work' : 'Not Available Remotely'} 
                        size="small"
                        sx={{ 
                          bgcolor: profile.remoteAvailability ? 'rgba(162, 123, 92, 0.2)' : 'rgba(63, 78, 79, 0.3)',
                          color: profile.remoteAvailability ? '#A27B5C' : 'rgba(220, 215, 201, 0.7)',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Fade>

              {/* Skills and Certifications */}
              <Fade in timeout={800} delay={600}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SchoolIcon /> Skills & Certifications
                  </Typography>
                  
                  <Stack spacing={2}>
                    {profile.skills?.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block', mb: 1 }}>
                          Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.skills.slice(0, 5).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(162, 123, 92, 0.1)',
                                color: '#A27B5C',
                                border: '1px solid rgba(162, 123, 92, 0.3)'
                              }}
                            />
                          ))}
                          {profile.skills.length > 5 && (
                            <Chip
                              label={`+${profile.skills.length - 5} more`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(44, 54, 57, 0.3)',
                                color: 'rgba(220, 215, 201, 0.7)'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {profile.languages?.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block', mb: 1 }}>
                          Languages
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.languages.map((language, index) => (
                            <Chip
                              key={index}
                              label={language}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(162, 123, 92, 0.1)',
                                color: '#A27B5C',
                                border: '1px solid rgba(162, 123, 92, 0.3)'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {profile.certifications?.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#A27B5C', display: 'block', mb: 1 }}>
                          Certifications
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.certifications.slice(0, 3).map((cert, index) => (
                            <Chip
                              key={index}
                              label={cert}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(162, 123, 92, 0.1)',
                                color: '#A27B5C',
                                border: '1px solid rgba(162, 123, 92, 0.3)'
                              }}
                            />
                          ))}
                          {profile.certifications.length > 3 && (
                            <Chip
                              label={`+${profile.certifications.length - 3} more`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(44, 54, 57, 0.3)',
                                color: 'rgba(220, 215, 201, 0.7)'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {(!profile.skills?.length && !profile.languages?.length && !profile.certifications?.length) && (
                      <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)', fontStyle: 'italic' }}>
                        No skills or certifications added yet
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Fade>

              {/* Ratings and Performance */}
              <Fade in timeout={800} delay={700}>
                <Paper
                  sx={{
                    bgcolor: '#3F4E4F',
                    p: 4,
                    borderRadius: 3,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StarIcon /> Ratings & Performance
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.9)' }}>
                        Average Rating
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        {profile.rating || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.9)' }}>
                        Job Success Rate
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        {profile.successRate || 'N/A'}%
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.9)' }}>
                        Total Completed
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                        {completedJobs.length}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Fade>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;