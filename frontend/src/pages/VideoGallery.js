import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
} from '@mui/material';
import { fetchVideos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserLink from '../components/UserLink';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const getVideos = async () => {
      try {
        const data = await fetchVideos(search);
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    getVideos();
  }, [search]);

  const handleCardClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: 'var(--color-header-bg)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Videos
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mr: 2, bgcolor: 'var(--color-bg)', borderRadius: 1, input: { color: 'var(--color-text)' } }}
            size="small"
          />
          {user && (
            <button
              onClick={() => navigate('/videomanager')}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-bg)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Manage Videos
            </button>
          )}
        </Toolbar>
      </AppBar>

      {/* Video Grid */}
      <Box sx={{ py: 5 }}>
        <Container>
          <Grid container spacing={3}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                  <Card
                    sx={{
                      bgcolor: 'var(--color-card-bg)',
                      color: 'var(--color-text)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'var(--color-accent)',
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                    onClick={() => handleCardClick(video._id)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <img
                        src={video.thumbnailUrl || "https://via.placeholder.com/320x180?text=Video+Thumbnail"}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '180px',
                          aspectRatio: '16/9',
                          objectFit: 'cover',
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2">
                        By: <UserLink userId={video.uploader._id} name={video.uploader.name} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ color: 'var(--color-text)', width: '100%', textAlign: 'center', mt: 2 }}>
                No videos found.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default VideoGallery;
