import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Modal, Card, CardContent } from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import Posts from '../components/posts/Posts';
import { fetchForumGroups } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ForumCategory = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const groups = await fetchForumGroups();
        const foundGroup = groups.find(g => g._id === groupId);
        setGroup(foundGroup);
      } catch (err) {
        console.error('Error fetching forum group:', err);
      }
    };
    loadGroup();
  }, [groupId]);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  if (!group) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
          {group.name}
        </Typography>
        <Typography sx={{ color: 'var(--color-text-gray)', mb: 3, textAlign: 'center' }}>
          {group.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} onClick={() => setOpenCreate(true)}>
            Create Thread
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} component={Link} to="/forum">
            Back to Forum
          </Button>
        </Box>

        <Posts refreshTrigger={refreshPosts} type="thread" groupId={groupId} />

        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 'var(--radius)', boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>Create Thread</Typography>
            <CreatePost
              onPostCreated={() => { setOpenCreate(false); triggerRefresh(); }}
              type="thread"
              groupId={groupId}
            />
            <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: 'var(--color-bg)', bgcolor: 'var(--color-error)' }}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ForumCategory;
