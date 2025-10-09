const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Chat = require('./models/Chat'); // Import Chat model
const http = require('http'); // Import HTTP module
const { initSocket } = require('./socket'); // Import initSocket from socket.js


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: '*', // ⚠️ Use http://localhost:3000 for development or specific Tailscale IP/URL for security
  credentials: true
}));

app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/transactions/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));
app.use('/uploads', express.static('uploads'));

// Routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/job', jobRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); 

const infoRoutes = require('./routes/infoRoutes'); // Import info routes
app.use('/api/info', infoRoutes); // Use info routes

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Existing video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

// New post routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

// Forum routes
const forumRoutes = require('./routes/forumRoutes');
app.use('/api/forum', forumRoutes);




// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB Connection Error:', err.message));


  // Dummy route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Create HTTP server
const server = http.createServer(app); 

// Initialize socket.io
initSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

