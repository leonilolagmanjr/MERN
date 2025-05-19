import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth for authentication context

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth(); // Get authentication state and logout function

  const handleLogout = () => {
    logout(); // Clear user session
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <h1 style={styles.logo}>PBuild</h1>
        <ul style={styles.navLinks}>
          <li>
            <Link to="/" style={styles.link}>Home</Link>
          </li>
          <li>
            <Link to="/tasks" style={styles.link}>Task List</Link>
          </li>
          <li>
            <Link to="/taskmanager" style={styles.link}>Task Manager</Link>
          </li>
        </ul>
      </div>
      <div style={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <Link to="/profile" style={styles.link}>
              {user?.name}'s Profile
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#171a21',
    color: '#c7d5e0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#c7d5e0',
    textDecoration: 'none',
    fontSize: '18px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4c4c',
    cursor: 'pointer',
    fontSize: '18px',
    textDecoration: 'underline',
  },
};

export default Navbar;