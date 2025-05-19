import React from 'react';
import { useAuth } from '../context/AuthContext';
import TaskManager from './TaskManager';

const Home = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <div style={styles.container}>
        <TaskManager />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to PBuild</h2>
      <p style={styles.description}>Log in to manage tasks and explore more features!</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    minHeight: '100vh',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
  },
};

export default Home;