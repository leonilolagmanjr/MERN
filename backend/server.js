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
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/task', taskRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); 

const infoRoutes = require('./routes/infoRoutes'); // Import info routes
app.use('/api/info', infoRoutes); // Use info routes

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);


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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
