import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './components/Auth';
import TaskList from './components/TaskList';

const App = () => {
  const [userName, setUserName] = useState('JohnDoe'); // Replace with dynamic user data

  return (
    <Router>
      <div>
        <Navbar userName={userName} />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;