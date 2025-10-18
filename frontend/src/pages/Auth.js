// src/pages/Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SliderCaptcha from '../components/SliderCaptcha';
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
  const [formData, setFormData] = useState({ 
    name: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [message, setMessage] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        // Login with name instead of email
        const response = await loginUser({ 
          name: formData.name, 
          password: formData.password 
        });
        login(response.user, response.token);
        setMessage(`Login successful! Welcome, ${response.user.name}`);
      } else {
        // Register with name instead of email
        const response = await registerUser({
          name: formData.name,
          password: formData.password
        });
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
    setCaptchaVerified(false);
    // Clear form data when toggling
    setFormData({ name: '', password: '', confirmPassword: '' });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: 'var(--color-bg)' }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: 'var(--radius)',
          width: { xs: '90%', sm: 400 },
          maxWidth: 400,
          textAlign: 'center',
          bgcolor: 'var(--color-card-bg)',
          color: 'var(--color-text)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-text)' }}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        {message && (
          <Alert 
            severity={message.includes('successful') ? 'success' : 'error'} 
            sx={{ marginBottom: 2 }}
          >
            {message}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            InputProps={{
              style: { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color-text)' },
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
              style: { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' },
            }}
            InputLabelProps={{
              style: { color: 'var(--color-text)' },
            }}
          />
          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={
                formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                  ? 'Passwords do not match' 
                  : ''
              }
              InputProps={{
                style: { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' },
              }}
              InputLabelProps={{
                style: { color: 'var(--color-text)' },
              }}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SliderCaptcha onPass={() => setCaptchaVerified(true)} />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!captchaVerified}
            sx={{
              bgcolor: 'var(--color-primary)',
              color: 'var(--color-bg)',
              '&:hover': { bgcolor: 'var(--color-accent)' },
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2, color: 'var(--color-text)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link
            component="button"
            onClick={toggleForm}
            sx={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Auth;