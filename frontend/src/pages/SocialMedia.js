import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Modal, Card, CardContent, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import CreatePost from '../components/posts/CreatePost';
import Posts from '../components/posts/Posts';
import { fetchForumGroups, createForumGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SocialMedia = () => {
  const { isLoggedIn } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateForum, setOpenCreateForum] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // null for social feed, groupId for forum

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchForumGroups();
        setGroups(data);
      } catch (err) {
        console.error('Error fetching forum groups:', err);
      }
    };
    loadGroups();
  }, []);

  const triggerRefresh = () => {
    setRefreshPosts(!refreshPosts);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleBackToSocial = () => {
    setSelectedGroup(null);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await createForumGroup({ name, description }, token);
      setName('');
      setDescription('');
      setOpenCreateForum(false);
      // Reload groups
      const data = await fetchForumGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error creating forum group:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedGroupData = groups.find(g => g._id === selectedGroup);

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Sidebar for Forum Groups */}
        <Box sx={{ width: '300px', flexShrink: 0 }}>
          <Card sx={{ bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>
                  Forum Groups
                </Typography>
                {isLoggedIn && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'var(--color-primary)',
                      borderColor: 'var(--color-primary)',
                      '&:hover': { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }
                    }}
                    onClick={() => setOpenCreateForum(true)}
                  >
                    Create
                  </Button>
                )}
              </Box>
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedGroup === null}
                    onClick={handleBackToSocial}
                    sx={{
                      '&.Mui-selected': { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' },
                      '&:hover': { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }
                    }}
                  >
                    <ListItemText primary="Social Feed" />
                  </ListItemButton>
                </ListItem>
                {groups.map((group) => (
                  <ListItem key={group._id} disablePadding>
                    <ListItemButton
                      selected={selectedGroup === group._id}
                      onClick={() => handleGroupSelect(group._id)}
                      sx={{
                        '&.Mui-selected': { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' },
                        '&:hover': { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }
                      }}
                    >
                      <ListItemText primary={group.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ color: 'var(--color-text)', mb: 3, textAlign: 'center' }}>
            {selectedGroup ? `${selectedGroupData?.name} Threads` : 'Social Media Feed'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            {isLoggedIn && (
              <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} onClick={() => setOpenCreate(true)}>
                {selectedGroup ? 'Create Thread' : 'Create Post'}
              </Button>
            )}
            <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} component={Link} to="/videos">
              View Videos
            </Button>
          </Box>

          <Posts
            refreshTrigger={refreshPosts}
            type={selectedGroup ? 'thread' : 'post'}
            groupId={selectedGroup}
          />

          {isLoggedIn && (
            <>
              <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 'var(--radius)', boxShadow: 24, minWidth: 400 }}>
                  <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>
                    {selectedGroup ? 'Create Thread' : 'Create Post'}
                  </Typography>
                  <CreatePost
                    onPostCreated={() => { setOpenCreate(false); triggerRefresh(); }}
                    type={selectedGroup ? 'thread' : 'post'}
                    groupId={selectedGroup}
                  />
                  <Button onClick={() => setOpenCreate(false)} sx={{ mt: 2, color: 'var(--color-text)', bgcolor: 'var(--color-error)' }}>Close</Button>
                </Box>
              </Modal>

              <Modal open={openCreateForum} onClose={() => setOpenCreateForum(false)}>
                <Box component="form" onSubmit={handleCreateGroup} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--color-card-bg)', p: 4, borderRadius: 'var(--radius)', boxShadow: 24, minWidth: 400 }}>
                  <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 2 }}>
                    Create Forum Group
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-primary)',
                        backgroundColor: 'var(--color-card-bg)',
                        color: 'var(--color-text)',
                        fontSize: '16px'
                      }}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-primary)',
                        backgroundColor: 'var(--color-card-bg)',
                        color: 'var(--color-text)',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                      required
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button type="button" onClick={() => setOpenCreateForum(false)} sx={{ color: 'var(--color-text)', bgcolor: 'var(--color-error)' }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg)' }} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SocialMedia;
