import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { fetchVideo } from '../../services/api';
import UserLink from '../UserLink';

const DisplayVideo = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const data = await fetchVideo(videoId);
        setVideo(data);
      } catch (err) {
        setError('Failed to load video.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  if (loading) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography sx={{ color: 'red', textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  if (!video) {
    return <Typography sx={{ color: 'var(--color-text-secondary)', textAlign: 'center', mt: 4 }}>Video not found.</Typography>;
  }

  return (
    <Box sx={{ bgcolor: 'var(--color-card-bg)', borderRadius: 2, p: 2, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <UserLink userId={video.uploader?._id} name={video.uploader?.name} sx={{ fontWeight: 'bold', mb: 1 }} />
        <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
          {dayjs(video.createdAt).format('h:mm A · MMM D, YYYY')}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ color: 'var(--color-text)', mb: 2 }}>
        {video.title}
      </Typography>
      {video.description && (
        <Typography sx={{ color: 'var(--color-text)', mb: 2 }}>
          {video.description}
        </Typography>
      )}
      <Box sx={{ mb: 2 }}>
        <video
          width="100%"
          height="auto"
          controls
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          style={{ maxHeight: '400px', borderRadius: 4 }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
          {video.views || 0} Views
        </Typography>
        <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
          {video.likes || 0} Likes
        </Typography>
      </Box>
    </Box>
  );
};

export default DisplayVideo;
