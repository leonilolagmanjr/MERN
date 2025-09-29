import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { fetchVideos, uploadVideo } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { isLoggedIn } = useAuth();

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

  const handleUpload = async () => {
    if (!file || !title) return;
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    try {
      const token = localStorage.getItem('token');
      await uploadVideo(formData, token);
      setUploadOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      // Refresh videos
      const data = await fetchVideos(search);
      setVideos(data);
    } catch (err) {
      console.error('Error uploading video:', err);
    }
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
          {isLoggedIn && (
            <Button variant="contained" onClick={() => setUploadOpen(true)}>
              Upload Video
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Video Grid */}
      <Box sx={{ py: 5 }}>
        <Container>
          <Grid container spacing={3}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video._id}>
                  <Card sx={{ bgcolor: '#2a475e', color: '#c7d5e0' }}>
                    <CardContent>
                      <video
                        width="100%"
                        height="auto"
                        style={{ maxHeight: '200px', aspectRatio: '16/9' }}
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
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {video.description}
                        </Typography>
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

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Videos;
