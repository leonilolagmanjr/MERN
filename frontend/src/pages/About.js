import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Button } from '@mui/material';
import SteamLogo from '../logo.svg';

const teamMembers = [
  {
    name: 'Leonilo Lagman Jr',
    role: 'Lead Developer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Moira Radam',
    role: 'UI/UX Designer',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    name: 'Leonilo Lagman Jr',
    role: 'Backend Engineer',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
];

const About = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1b2838 0%, #171a21 100%)',
      color: '#c7d5e0',
      py: 6,
    }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar src={SteamLogo} sx={{ width: 64, height: 64, mr: 2, bgcolor: '#171a21' }} />
          <Typography variant="h3" fontWeight="bold" color="#66c0f4">
            About Us
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Welcome to our platform! Inspired by Steam, we bring gamers and developers together to create, share, and enjoy amazing experiences. Our mission is to foster a vibrant community where innovation and fun thrive.
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={4} key={member.name}>
              <Card sx={{ bgcolor: '#23262e', color: '#c7d5e0', boxShadow: 3 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar src={member.avatar} sx={{ width: 80, height: 80, mb: 2, bgcolor: '#171a21' }} />
                  <Typography variant="h6" color="#66c0f4" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="#c7d5e0" sx={{ mb: 1 }}>
                    {member.role}
                  </Typography>
                  <Button variant="contained" sx={{ bgcolor: '#66c0f4', color: '#23262e', mt: 1, textTransform: 'none', fontWeight: 'bold' }}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="#8f98a0">
            &copy; {new Date().getFullYear()} Steam-Inspired Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;