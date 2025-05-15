import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';

const Home = () => {
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleLogin = () => {
    navigate('/auth'); // Navigate to the login/register screen
  };

  const handleRegister = () => {
    navigate('/auth'); // Navigate to the same screen (you can differentiate later if needed)
  };

  return (
    <div style={styles.container}>
      <div style={styles.centerContent}>
        <h2 style={styles.heading}>Welcome to PBuild</h2>
        <p style={styles.description}>
          Explore tasks and manage your profile. Log in to unlock full access to the task list!
        </p>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
          <button style={styles.button} onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
      <div style={styles.blurredSection}>
        <TaskList />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100vh',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    padding: '20px',
  },
  centerContent: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '10px',
  },
  description: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#c7d5e0',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
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
  blurredSection: {
    width: '100%',
    filter: 'blur(8px)', // Apply blur effect
    pointerEvents: 'none', // Disable clicks and interactions
    opacity: 0.5, // Reduce visibility
    marginTop: '20px',
  },
};

export default Home;