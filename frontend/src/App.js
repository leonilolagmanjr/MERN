import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import ReadTask from './components/tasks/ReadTask';
import TaskManager from './pages/TaskManager'; // Import TaskManager component
import BrowseJobs from './pages/BrowseJobs'; // Import the new page
import Job from './pages/Job';
import ChatWidget from './components/ChatWidget';

const App = () => {
  const { isLoggedIn } = useAuth(); // Use isLoggedIn to determine the user's status

  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            {/* Render Home for both logged-in and logged-out users */}
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<ReadTask />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Auth />} />
            <Route path="/taskmanager" element={<TaskManager />} /> {/* Add TaskManager route */}
            <Route path="/browse" element={<BrowseJobs />} /> {/* Add BrowseJobs route */}
            <Route path="/job/:jobId" element={<Job />} /> {/* Add Job route */}
          </Routes>
        </div>
        <ChatWidget /> {/* Include ChatWidget for chat functionality */}
      </div>
    </Router>
  );
};

export default App;