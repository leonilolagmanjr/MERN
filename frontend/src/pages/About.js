import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Button } from '@mui/material';
import SteamLogo from '../logo.svg';

const About = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1b2838 0%, #171a21 100%)',
      color: '#c7d5e0',
      py: 6,
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar src={SteamLogo} sx={{ width: 64, height: 64, mr: 2, bgcolor: '#171a21' }} />
          <Typography variant="h3" fontWeight="bold" color="#66c0f4">
            About Me
          </Typography>
        </Box>

        {/* Intro */}
        <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6 }}>
          Hi, I’m <b>Leonilo Lagman Jr</b>, a passionate <b>solo Full Stack Developer</b> specializing in the <b>MERN stack</b> (MongoDB, Express.js, React.js, Node.js).
          I love building scalable platforms, modern web applications, and systems that solve real-world problems.  
          <br /><br />
          This project is heavily inspired by Steam’s community features, reimagined for job connections, collaboration, and social interaction. 
          As a solo developer, I handle everything from backend APIs to frontend UI/UX, ensuring a smooth, polished experience.
        </Typography>

        {/* Personal Card */}
        <Card sx={{ bgcolor: '#23262e', color: '#c7d5e0', boxShadow: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              src="https://github.com/leonilolagmanjr" // Replace with your GitHub/real avatar
              sx={{ width: 100, height: 100, mb: 2, bgcolor: '#171a21' }} 
            />
            <Typography variant="h5" color="#66c0f4" fontWeight="bold">
              Leonilo Lagman Jr
            </Typography>
            <Typography variant="body2" color="#c7d5e0" sx={{ mb: 1 }}>
              Solo Full Stack Developer
            </Typography>
            <Typography variant="body2" color="#8f98a0" sx={{ textAlign: 'center', mb: 2 }}>
              Experienced in building full-featured platforms and web apps. 
              I specialize in handling projects end-to-end — from backend systems to frontend UI/UX.
            </Typography>
            <Button 
              variant="contained" 
              href="https://github.com/leonilolagmanjr" // 🔗 replace with your portfolio or GitHub
              target="_blank"
              sx={{ bgcolor: '#66c0f4', color: '#23262e', mt: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              View Portfolio
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="#8f98a0">
            &copy; {new Date().getFullYear()} Built by Leonilo Lagman Jr — All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
