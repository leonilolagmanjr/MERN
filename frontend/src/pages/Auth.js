// src/pages/Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
} from '@mui/material';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await loginUser({ email: formData.email, password: formData.password });
        login(response.user, response.token);
        setMessage(`Login successful! Welcome, ${response.user.name}`);
      } else {
        const response = await registerUser(formData);
        login(response.user, response.token);
        setMessage(`Registration successful! Welcome, ${response.user.name}`);
      }
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#1b2838"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: 400,
          textAlign: 'center',
          backgroundColor: '#2a475e',
          color: '#c7d5e0',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        {message && (
          <Alert severity="info" sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {!isLogin && (
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputProps={{
                style: { backgroundColor: '#1b2838', color: '#c7d5e0' },
              }}
              InputLabelProps={{
                style: { color: '#c7d5e0' },
              }}
            />
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              style: { backgroundColor: '#1b2838', color: '#c7d5e0' },
            }}
            InputLabelProps={{
              style: { color: '#c7d5e0' },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              style: { backgroundColor: '#1b2838', color: '#c7d5e0' },
            }}
            InputLabelProps={{
              style: { color: '#c7d5e0' },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#66c0f4',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#5aafde' },
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2, color: '#c7d5e0' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link
            component="button"
            onClick={toggleForm}
            sx={{ color: '#66c0f4', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Auth;
