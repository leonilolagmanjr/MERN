import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userName }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <h1 style={styles.logo}>Steam Clone</h1>
        <ul style={styles.navLinks}>
          <li>
            <Link to="/" style={styles.link}>Home</Link>
          </li>
          <li>
            <Link to="/tasks" style={styles.link}>Task List</Link>
          </li>
        </ul>
      </div>
      <div style={styles.rightSection}>
        {userName ? (
          <Link to="/profile" style={styles.link}>
            {userName}'s Profile
          </Link>
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
    backgroundColor: '#171a21', // Steam's navbar background
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
};

export default Navbar;