import React from 'react';
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
  Link,
} from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ bgcolor: '#1b2838', color: '#c7d5e0', minHeight: '100vh' }}>
      {/* Navbar */}
      

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#2a475e',
          py: 10,
          textAlign: 'center',
          mt: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: '#ffffff', mb: 2 }}>
            Hire Top Talent for Any Job — Fast
          </Typography>
          <Typography variant="h6" sx={{ color: '#c7d5e0' }}>
            Connect with skilled freelancers and businesses in minutes.
          </Typography>
        </Container>
      </Box>

      {/* Featured Section */}
      <Box id="featured" sx={{ py: 5 }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: '#ffffff', textAlign: 'center', mb: 4 }}
          >
            Featured Jobs
          </Typography>
          <Grid container spacing={3}>
            {['Job 1', 'Job 2', 'Job 3', 'Job 4'].map((job, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ bgcolor: '#2a475e', color: '#c7d5e0', textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                      {job}
                    </Typography>
                    <Typography>Details about {job}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box id="categories" sx={{ py: 5, bgcolor: '#1b2838' }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ color: '#ffffff', textAlign: 'center', mb: 4 }}
          >
            Categories
          </Typography>
          <Grid container spacing={3}>
            {['Web Development', 'Graphic Design', 'Writing & Translation', 'Marketing'].map(
              (category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ bgcolor: '#2a475e', color: '#c7d5e0', textAlign: 'center' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        {category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          bgcolor: '#171a21',
          color: '#c7d5e0',
        }}
      >
        <Typography>© 2025 PBuild. All rights reserved.</Typography>
        <Typography>About | Privacy Policy | Terms of Service</Typography>
      </Box>
    </Box>
  );
};

export default Home;
