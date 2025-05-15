import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MainHome from './pages/MainHome';
import TaskList from './components/TaskList';
import Auth from './pages/Auth'; // Updated import
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isLoggedIn } = useAuth(); // Use isLoggedIn to determine the user's status

  return (
    <Router>
      <div>
        <Navbar /> {/* Removed unused userName prop */}
        <div style={{ padding: '20px' }}>
          <Routes>
            {/* Conditionally render MainHome or Home based on login status */}
            <Route path="/" element={isLoggedIn ? <MainHome /> : <Home />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/auth" element={<Auth />} /> {/* Updated component */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;