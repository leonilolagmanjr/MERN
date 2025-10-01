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
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#2a475e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Videos
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mr: 2, bgcolor: '#ffffff', borderRadius: 1 }}
            size="small"
          />
          {user && (
            <button
              onClick={() => navigate('/videomanager')}
              style={{
                backgroundColor: '#66c0f4',
                color: '#fff',
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
                      bgcolor: '#2a475e',
                      color: '#c7d5e0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#3a586e',
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                    onClick={() => handleCardClick(video._id)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <img
                        src={video.thumbnailUrl ? `http://${window.location.hostname}:5000${video.thumbnailUrl}` : "https://via.placeholder.com/320x180?text=Video+Thumbnail"}
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
                        By: {video.uploader.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ color: '#c7d5e0', width: '100%', textAlign: 'center', mt: 2 }}>
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
