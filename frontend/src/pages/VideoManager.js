import React, { useState, useEffect } from 'react';
import EditVideo from '../components/videos/EditVideo';
import DeleteVideo from '../components/videos/DeleteVideo';
import { Modal } from '@mui/material';
import { fetchUserVideos, uploadVideo } from '../services/api';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import CollapsibleText from '../components/CollapsibleText';

const VideoManager = () => {
  const [refreshVideos, setRefreshVideos] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  // Modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const triggerRefresh = () => {
    setRefreshVideos(!refreshVideos);
  };

  useEffect(() => {
    const fetchUserVideosData = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchUserVideos(token);
        setUserVideos(data);
      } catch (err) {
        console.error('Error fetching user videos:', err);
      }
    };
    fetchUserVideosData();
  }, [refreshVideos]);

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
      triggerRefresh();
    } catch (err) {
      console.error('Error uploading video:', err);
    }
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setOpenEdit(true);
  };

  const handleDelete = (video) => {
    setSelectedVideo(video);
    setOpenDelete(true);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
          Video Manager
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
          <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)', fontWeight: 'bold' }} onClick={() => setUploadOpen(true)}>
            Upload Video
          </Button>
        </Box>

        {/* User Videos Table */}
        <Box sx={{ bgcolor: 'var(--color-card-bg)', borderRadius: 2, boxShadow: 3, mb: 4, p: 2 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 2 }}>
            My Videos ({userVideos.length})
          </Typography>
          {/* Table Labels */}
          <Box sx={{ display: 'flex', px: 2, py: 1, bgcolor: 'var(--color-bg)', borderRadius: 1, fontWeight: 'bold', color: 'var(--color-text)', fontSize: 16 }}>
            <Box sx={{ flex: 2 }}>Title</Box>
            <Box sx={{ flex: 3 }}>Description</Box>
            <Box sx={{ flex: 1 }}>Upload Date</Box>
            <Box sx={{ flex: 1, textAlign: 'right' }}>Actions</Box>
          </Box>
          {/* Table Rows */}
          {userVideos.length === 0 ? (
            <Box sx={{ px: 2, py: 2, color: 'var(--color-text-gray)' }}>
              You have not uploaded any videos yet.
            </Box>
          ) : (
            userVideos.map((video) => (
              <Box key={video._id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: '1px solid var(--color-accent)', ':last-child': { borderBottom: 'none' } }}>
                <Box sx={{ flex: 2, color: 'var(--color-primary)', fontWeight: 'bold' }}>{video.title}</Box>
                <Box sx={{ flex: 3, color: 'var(--color-text)' }}>
                  {video.description ? (
                    <CollapsibleText text={video.description} limit={100} />
                  ) : (
                    'No description'
                  )}
                </Box>
                <Box sx={{ flex: 1, color: 'var(--color-text)' }}>{new Date(video.createdAt).toLocaleDateString()}</Box>
                <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    sx={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'none' }}
                    onClick={() => handleEdit(video)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: 'var(--color-error)', fontWeight: 'bold', textTransform: 'none' }}
                    onClick={() => handleDelete(video)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
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

        {/* Edit Modal */}
        <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            {selectedVideo && <EditVideo video={selectedVideo} onVideoUpdated={triggerRefresh} onClose={() => setOpenEdit(false)} />}
          </Box>
        </Modal>

        {/* Delete Modal */}
        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            {selectedVideo && <DeleteVideo video={selectedVideo} onVideoDeleted={triggerRefresh} onClose={() => setOpenDelete(false)} />}
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};

export default VideoManager;
