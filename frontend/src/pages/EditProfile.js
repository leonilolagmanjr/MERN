import React, { useState } from 'react';
import { updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, Typography, Avatar, Button, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Select, MenuItem } from '@mui/material';

const sidebarItems = [
  'General',
  'Avatar',
  'Profile Background',
  'Mini Profile',
  'Theme',
  'Featured Badge',
  'Privacy Settings',
];

const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: '',
    summary: '',
    avatar: null,
    profileBackground: '',
    featuredBadges: [],
    featuredGroup: '',
    featuredShowcase: '',
  });
  const [selectedSection, setSelectedSection] = useState('General');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await updateUserProfile(formData, token);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    window.location.href = '/profile';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1b2838 0%, #171a21 100%)',
      color: '#c7d5e0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      py: 6,
    }}>
      <Card sx={{ width: 900, bgcolor: '#23262e', boxShadow: 6, display: 'flex', minHeight: 600 }}>
        {/* Sidebar */}
        <Box sx={{ width: 220, bgcolor: '#23262e', borderRight: '1px solid #2a475e', p: 2 }}>
          <Avatar src={user?.avatarUrl} sx={{ width: 64, height: 64, mb: 2, mx: 'auto' }} />
          <Typography variant="h6" align="center" sx={{ color: '#ffffff', mb: 2 }}>
            {user?.name}
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: '#2a475e' }} />
          <List>
            {sidebarItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  selected={selectedSection === item}
                  onClick={() => setSelectedSection(item)}
                  sx={{ borderRadius: 1, color: selectedSection === item ? '#66c0f4' : '#c7d5e0', mb: 1 }}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" sx={{ mt: 2, color: '#66c0f4', borderColor: '#66c0f4' }}>
            Steam Points Shop
          </Button>
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffffff', mb: 1 }}>
            About
          </Typography>
          <Typography sx={{ color: '#c7d5e0', mb: 2 }}>
            Set your profile name and details. Providing additional information like your real name can help friends find you on the Steam Community.<br />
            Your profile name and avatar represent you throughout Steam, and must be appropriate for all audiences. Please see the <span style={{ color: '#66c0f4', textDecoration: 'underline', cursor: 'pointer' }}>FAQ</span> for more details.
          </Typography>
          <Divider sx={{ mb: 3, bgcolor: '#2a475e' }} />
          {/* General Section */}
          {selectedSection === 'General' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#c7d5e0', mb: 2 }}>
                GENERAL
              </Typography>
              <TextField
                label="Profile Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ style: { color: '#c7d5e0', backgroundColor: '#2a475e' } }}
                InputLabelProps={{ style: { color: '#66c0f4' } }}
              />
              <TextField
                label="Real Name"
                name="realName"
                value={formData.realName || ''}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ style: { color: '#c7d5e0', backgroundColor: '#2a475e' } }}
                InputLabelProps={{ style: { color: '#66c0f4' } }}
                helperText={<span style={{ color: '#8f98a0' }}>Optional</span>}
              />
              <TextField
                label="Custom URL"
                name="customUrl"
                value={formData.customUrl || ''}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 1 }}
                InputProps={{ style: { color: '#c7d5e0', backgroundColor: '#2a475e' } }}
                InputLabelProps={{ style: { color: '#66c0f4' } }}
                helperText={<span style={{ color: '#8f98a0' }}>Your profile will be available at: https://steamcommunity.com/profiles/76561198868415243/</span>}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#c7d5e0', mt: 3, mb: 2 }}>
                LOCATION
              </Typography>
              <Select
                label="Country"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2, color: '#c7d5e0', backgroundColor: '#2a475e' }}
                MenuProps={{ PaperProps: { style: { backgroundColor: '#23262e', color: '#c7d5e0' } } }}
              >
                <MenuItem value="">Select a country</MenuItem>
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Taiwan">Taiwan</MenuItem>
                {/* Add more countries as needed */}
              </Select>
            </Box>
          )}
          {/* Other sections can be added similarly */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={handleCancel} variant="contained" sx={{ bgcolor: '#ff4c4c', color: '#fff', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#66c0f4', color: '#fff', textTransform: 'none' }}>
              Save
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};


export default EditProfile;