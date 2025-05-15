import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const MainHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from context

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout(); // Clear user data and token
    navigate('/'); // Redirect to the home page
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeading}>Dashboard</h2>
        <ul style={styles.sidebarLinks}>
          <li onClick={() => handleNavigate('/tasks')}>Task List</li>
          <li onClick={() => handleNavigate('/profile')}>My Profile</li>
          <li onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.featured}>
          <h2 style={styles.featuredHeading}>Featured Tasks</h2>
          <div style={styles.featuredContent}>
            <div style={styles.featuredItem}>
              <h3>Task 1</h3>
              <p>Complete this task to earn rewards!</p>
            </div>
            <div style={styles.featuredItem}>
              <h3>Task 2</h3>
              <p>Help others and gain experience points!</p>
            </div>
          </div>
        </div>

        <div style={styles.categories}>
          <h2 style={styles.categoriesHeading}>Browse Categories</h2>
          <div style={styles.categoriesContent}>
            <button style={styles.categoryButton}>Easy Tasks</button>
            <button style={styles.categoryButton}>Medium Tasks</button>
            <button style={styles.categoryButton}>Hard Tasks</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#171a21',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
  },
  sidebarHeading: {
    fontSize: '20px',
    color: '#66c0f4',
    marginBottom: '20px',
  },
  sidebarLinks: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  logoutButton: {
    cursor: 'pointer',
    color: '#ff4c4c',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
  },
  featured: {
    marginBottom: '40px',
  },
  featuredHeading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  featuredContent: {
    display: 'flex',
    gap: '20px',
  },
  featuredItem: {
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
    flex: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  categories: {
    marginBottom: '40px',
  },
  categoriesHeading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  categoriesContent: {
    display: 'flex',
    gap: '10px',
  },
  categoryButton: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default MainHome;