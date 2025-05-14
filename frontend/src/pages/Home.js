import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Add a CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <div className="dashboard">
        <h2>Welcome to PBuild</h2>
        <p>Explore tasks, manage your profile, and more!</p>
        <div className="buttons">
          <Link to="/tasks" className="nav-button">View Tasks</Link>
          <Link to="/auth" className="nav-button">Login/Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;