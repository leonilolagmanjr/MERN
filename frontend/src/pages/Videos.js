import React, { useEffect, useState } from 'react';
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
import CollapsibleText from '../components/CollapsibleText';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');

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
        </Toolbar>
      </AppBar>

      {/* Video Grid */}
      <Box sx={{ py: 5 }}>
        <Container>
          <Grid container spacing={3}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                  <Card sx={{ bgcolor: '#2a475e', color: '#c7d5e0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <video
                        width="100%"
                        height="auto"
                        style={{ maxHeight: '240px', aspectRatio: '16/9' }}
                        controls
                        src={`http://${window.location.hostname}:5000/api/videos/stream/${video.videoUrl.split('/').pop()}`}
                      />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2">
                        By: {video.uploader.name}
                      </Typography>
                      {video.description && (
                        <CollapsibleText text={video.description} limit={100} />
                      )}
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

export default Videos;
