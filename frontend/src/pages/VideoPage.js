import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import { fetchVideo } from '../services/api';
import CollapsibleText from '../components/CollapsibleText';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const data = await fetchVideo(id);
        setVideo(data);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Video not found');
      } finally {
        setLoading(false);
      }
    };
    getVideo();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Card sx={{ bgcolor: '#2a475e', color: '#c7d5e0' }}>
          <CardContent>
            <video
              width="100%"
              height="auto"
              controls
              src={`http://${window.location.hostname}:5000/api/videos/stream/${video.videoUrl.split('/').pop()}`}
              style={{ maxHeight: '500px', aspectRatio: '16/9' }}
            />
            <Typography variant="h4" sx={{ mt: 2 }}>
              {video.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              By:{' '}
              <Link to={`/profile/${video.uploader._id}`} style={{ color: '#66c0f4', textDecoration: 'none' }}>
                {video.uploader.name}
              </Link>
            </Typography>
            {video.description && (
              <Box sx={{ mt: 2 }}>
                <CollapsibleText text={video.description} limit={200} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VideoPage;
