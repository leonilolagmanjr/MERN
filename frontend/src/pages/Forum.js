import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Modal } from '@mui/material';
import { fetchForumGroups, createForumGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Forum = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await createForumGroup({ name, description }, token);
      setName('');
      setDescription('');
      setOpenCreate(false);
      // Reload groups
      const data = await fetchForumGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error creating forum group:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
          Forum
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button variant="contained" sx={{ bgcolor: '#66c0f4', color: '#fff' }} onClick={() => setOpenCreate(true)}>
              Create Group
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {groups.map((group) => (
            <Card key={group._id} sx={{ bgcolor: '#2a475e', color: '#c7d5e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#66c0f4' }}>
                  <Link to={`/forum/${group._id}`} style={{ color: '#66c0f4', textDecoration: 'none' }}>
                    {group.name}
                  </Link>
                </Typography>
                <Typography sx={{ color: '#8f98a0' }}>{group.description}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#8f98a0' }}>
                  Created by {group.createdBy.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#23262e', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400 }}>
            <Typography variant="h6" sx={{ color: '#66c0f4', mb: 2 }}>Create Forum Group</Typography>
            <form onSubmit={handleCreateGroup}>
              <input
                type="text"
                placeholder="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #66c0f4' }}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #66c0f4' }}
                required
              />
              <Button type="submit" variant="contained" sx={{ bgcolor: '#66c0f4', color: '#fff', mr: 2 }} disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
              <Button onClick={() => setOpenCreate(false)} sx={{ color: '#fff', bgcolor: '#ff4c4c' }}>Close</Button>
            </form>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Forum;
