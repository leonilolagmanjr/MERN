import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import ReadTask from './components/tasks/ReadTask';
import Market from './pages/Market'; // Import Market component
import BrowseProducts from './pages/BrowseProducts'; // Import the new page
import ChatWidget from './components/ChatWidget';
import EditProfile from './pages/EditProfile'; // Import EditProfile
import About from './pages/About';
import VideoGallery from './pages/VideoGallery'; // Import VideoGallery
import VideoPage from './pages/VideoPage'; // Import VideoPage
import VideoManager from './pages/VideoManager'; // Import VideoManager
import SocialMedia from './pages/SocialMedia'; // Import SocialMedia
import Product from './pages/Product'; // Import Product

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
            <Route path="/profile/:userId" element={isLoggedIn ? <Profile /> : <Auth />} /> {/* Add dynamic Profile route */}
            <Route path="/market" element={<Market />} /> {/* Add Market route */}
            <Route path="/browse" element={<BrowseProducts />} /> {/* Add BrowseProducts route */}
            <Route path="/product/:productId" element={<Product />} /> {/* Add Product route */}
            <Route path="/editprofile" element={<EditProfile />} /> {/* Add EditProfile route */}
            <Route path="/about" element={<About />} /> {/* Add About route */}
            <Route path="/videos" element={<VideoGallery />} /> {/* Add VideoGallery route */}
            <Route path="/video/:id" element={<VideoPage />} /> {/* Add VideoPage route */}
            <Route path="/videomanager" element={<VideoManager />} /> {/* Add VideoManager route */}
            <Route path="/social" element={<SocialMedia />} /> {/* Add SocialMedia route */}
          </Routes>
        </div>
        <ChatWidget /> {/* Include ChatWidget for chat functionality */}
      </div>
    </Router>
  );
};

export default App;
