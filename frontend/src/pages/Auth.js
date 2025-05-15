// src/pages/Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Handle login
        const response = await loginUser({ email: formData.email, password: formData.password });
        login(response.user, response.token); // Update context and localStorage
        setMessage(`Login successful! Welcome, ${response.user.name}`);
      } else {
        // Handle registration
        const response = await registerUser(formData);
        login(response.user, response.token); // Update context and localStorage
        setMessage(`Registration successful! Welcome, ${response.user.name}`);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and register forms
    setMessage(''); // Clear any previous messages
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>{isLogin ? 'Login' : 'Register'}</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                style={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span style={styles.toggleLink} onClick={toggleForm}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
  },
  formContainer: {
    backgroundColor: '#2a475e',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '20px',
  },
  message: {
    color: '#66c0f4',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#c7d5e0',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  toggleText: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#c7d5e0',
  },
  toggleLink: {
    color: '#66c0f4',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Auth;
