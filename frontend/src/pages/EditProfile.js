import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserProfile, updateInfo, uploadAvatar } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, Typography, Avatar, Button, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Select, MenuItem, Chip, FormControlLabel, Checkbox } from '@mui/material';

const sidebarItems = [
  'Basic Information',
  'Skills & Certifications',
  'Preferences',
  'Avatar',
  'Profile Background',
];

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    remoteAvailability: false,
    skills: [],
    languages: [],
    certifications: [],
    newSkill: '',
    newLanguage: '',
    newCertification: '',
  });
  const [selectedSection, setSelectedSection] = useState('Basic Information');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userProfile = await getUserProfile(user?.id, token);
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          remoteAvailability: userProfile.remoteAvailability || false,
          skills: userProfile.skills || [],
          languages: userProfile.languages || [],
          certifications: userProfile.certifications || [],
          newSkill: '',
          newLanguage: '',
          newCertification: '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddItem = (field) => {
    const newItem = formData[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
    if (newItem && !formData[field].includes(newItem)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem],
        [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        remoteAvailability: formData.remoteAvailability,
        skills: formData.skills,
        languages: formData.languages,
        certifications: formData.certifications,
      };
      
      await updateUserProfile(updateData, token);
      alert('Profile updated successfully!');
      window.location.href = '/profile';
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Only JPG and PNG files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await uploadAvatar(formData, token);
      setProfile(prev => ({ ...prev, profileImage: response.profileImage }));
      alert('Avatar uploaded successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Error uploading avatar. Please try again.');
    }
  };

  const handleCancel = () => {
    window.location.href = '/profile';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'var(--color-bg)',
      color: 'var(--color-text)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      py: 6,
    }}>
      <Card sx={{ width: 1000, bgcolor: 'var(--color-card-bg)', boxShadow: 6, display: 'flex', minHeight: 600 }}>
        {/* Sidebar */}
        <Box sx={{ width: 220, bgcolor: 'var(--color-card-bg)', borderRight: `1px solid var(--color-border)`, p: 2 }}>
          <Avatar 
            src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'} 
            sx={{ width: 64, height: 64, mb: 2, mx: 'auto' }} 
          />
          <Typography variant="h6" align="center" sx={{ color: 'var(--color-text)', mb: 2 }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: 'var(--color-text-gray)', mb: 2 }}>
            Level {profile.level || 1} • {profile.experience || 0} XP
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: 'var(--color-border)' }} />
          <List>
            {sidebarItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  selected={selectedSection === item}
                  onClick={() => setSelectedSection(item)}
                  sx={{ 
                    borderRadius: 1, 
                    color: selectedSection === item ? 'var(--color-accent)' : 'var(--color-text-gray)', 
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'var(--color-button-bg)',
                    }
                  }}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--color-text)', mb: 1 }}>
            Edit Profile
          </Typography>
          <Typography sx={{ color: 'var(--color-text-gray)', mb: 2 }}>
            Update your profile information to help others learn more about your skills and preferences.
          </Typography>
          <Divider sx={{ mb: 3, bgcolor: 'var(--color-border)' }} />

          {/* Basic Information Section */}
          {selectedSection === 'Basic Information' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--color-accent)', mb: 3 }}>
                BASIC INFORMATION
              </Typography>
              
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ 
                  style: { 
                    color: 'var(--color-text)', 
                    backgroundColor: 'var(--color-button-bg)',
                    border: '1px solid var(--color-border)'
                  } 
                }}
                InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
              />

              <TextField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: {
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-button-bg)',
                    border: '1px solid var(--color-border)'
                  }
                }}
                InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ 
                  style: { 
                    color: 'var(--color-text)', 
                    backgroundColor: 'var(--color-button-bg)',
                    border: '1px solid var(--color-border)'
                  } 
                }}
                InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
              />

              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ 
                  style: { 
                    color: 'var(--color-text)', 
                    backgroundColor: 'var(--color-button-bg)',
                    border: '1px solid var(--color-border)'
                  } 
                }}
                InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.remoteAvailability}
                    onChange={handleInputChange}
                    name="remoteAvailability"
                    sx={{
                      color: 'var(--color-accent)',
                      '&.Mui-checked': {
                        color: 'var(--color-accent)',
                      },
                    }}
                  />
                }
                label="Available for Remote Work"
                sx={{ color: 'var(--color-text)' }}
              />
            </Box>
          )}

          {/* Skills & Certifications Section */}
          {selectedSection === 'Skills & Certifications' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--color-accent)', mb: 3 }}>
                SKILLS & CERTIFICATIONS
              </Typography>

              {/* Skills */}
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text)', mb: 2 }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  label="Add Skill"
                  name="newSkill"
                  value={formData.newSkill}
                  onChange={handleInputChange}
                  sx={{ flex: 1 }}
                  InputProps={{ 
                    style: { 
                      color: 'var(--color-text)', 
                      backgroundColor: 'var(--color-button-bg)',
                      border: '1px solid var(--color-border)'
                    } 
                  }}
                  InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleAddItem('skills')}
                  sx={{ 
                    bgcolor: 'var(--color-accent)', 
                    color: 'var(--color-bg)',
                    '&:hover': {
                      bgcolor: 'var(--color-accent-dark)',
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ mb: 3 }}>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveItem('skills', index)}
                    sx={{ 
                      m: 0.5, 
                      bgcolor: 'var(--color-button-bg)', 
                      color: 'var(--color-text)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-text-gray)',
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Languages */}
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text)', mb: 2 }}>
                Languages
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  label="Add Language"
                  name="newLanguage"
                  value={formData.newLanguage}
                  onChange={handleInputChange}
                  sx={{ flex: 1 }}
                  InputProps={{ 
                    style: { 
                      color: 'var(--color-text)', 
                      backgroundColor: 'var(--color-button-bg)',
                      border: '1px solid var(--color-border)'
                    } 
                  }}
                  InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleAddItem('languages')}
                  sx={{ 
                    bgcolor: 'var(--color-accent)', 
                    color: 'var(--color-bg)',
                    '&:hover': {
                      bgcolor: 'var(--color-accent-dark)',
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ mb: 3 }}>
                {formData.languages.map((language, index) => (
                  <Chip
                    key={index}
                    label={language}
                    onDelete={() => handleRemoveItem('languages', index)}
                    sx={{ 
                      m: 0.5, 
                      bgcolor: 'var(--color-button-bg)', 
                      color: 'var(--color-text)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-text-gray)',
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Certifications */}
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text)', mb: 2 }}>
                Certifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  label="Add Certification"
                  name="newCertification"
                  value={formData.newCertification}
                  onChange={handleInputChange}
                  sx={{ flex: 1 }}
                  InputProps={{ 
                    style: { 
                      color: 'var(--color-text)', 
                      backgroundColor: 'var(--color-button-bg)',
                      border: '1px solid var(--color-border)'
                    } 
                  }}
                  InputLabelProps={{ style: { color: 'var(--color-accent)' } }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleAddItem('certifications')}
                  sx={{ 
                    bgcolor: 'var(--color-accent)', 
                    color: 'var(--color-bg)',
                    '&:hover': {
                      bgcolor: 'var(--color-accent-dark)',
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ mb: 3 }}>
                {formData.certifications.map((certification, index) => (
                  <Chip
                    key={index}
                    label={certification}
                    onDelete={() => handleRemoveItem('certifications', index)}
                    sx={{ 
                      m: 0.5, 
                      bgcolor: 'var(--color-button-bg)', 
                      color: 'var(--color-text)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-text-gray)',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Preferences Section */}
          {selectedSection === 'Preferences' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--color-accent)', mb: 3 }}>
                PREFERENCES
              </Typography>
              <Typography sx={{ color: 'var(--color-text-gray)', mb: 3 }}>
                Additional preference settings will be added here based on your application's requirements.
              </Typography>
            </Box>
          )}

          {/* Avatar Section */}
          {selectedSection === 'Avatar' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--color-accent)', mb: 3 }}>
                AVATAR
              </Typography>
              <Typography sx={{ color: 'var(--color-text-gray)', mb: 3 }}>
                Upload a new profile picture. The image will be cropped to a square format.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
                  sx={{ width: 120, height: 120, border: '3px solid var(--color-accent)' }}
                />
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarUpload}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        bgcolor: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'var(--color-accent-dark)',
                        }
                      }}
                    >
                      Upload New Avatar
                    </Button>
                  </label>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-gray)', mt: 1 }}>
                    JPG, PNG up to 5MB
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Profile Background Section */}
          {selectedSection === 'Profile Background' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--color-accent)', mb: 3 }}>
                PROFILE BACKGROUND
              </Typography>
              <Typography sx={{ color: 'var(--color-text-gray)', mb: 3 }}>
                Profile background customization will be implemented here.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button 
              onClick={handleCancel} 
              variant="outlined" 
              sx={{ 
                borderColor: 'var(--color-error)', 
                color: 'var(--color-error)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-error-dark)',
                  backgroundColor: 'rgba(244, 67, 54, 0.04)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ 
                bgcolor: 'var(--color-accent)', 
                color: 'var(--color-bg)',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'var(--color-accent-dark)',
                }
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default EditProfile;