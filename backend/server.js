const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Chat = require('./models/Chat'); // Import Chat model
const http = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import socket.io


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

// Function to ensure the global chat room exists
const ensureGlobalChatRoom = async () => {
  try {
    const globalChat = await Chat.findOne({ participants: [] }); // Global chat has no specific participants
    if (!globalChat) {
      await Chat.create({ participants: [], lastMessage: 'Welcome to the global chat!' });
      console.log('Global chat room created.');
    } else {
      console.log('Global chat room already exists.');
    }
  } catch (err) {
    console.error('Error ensuring global chat room:', err.message);
  }
};

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await ensureGlobalChatRoom(); // Ensure global chat room exists
  })
  .catch(err => console.error('MongoDB Connection Error:', err.message));


  // Dummy route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Create HTTP server
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', (message) => {
    const { chatId, content } = message;
    io.to(chatId).emit('receiveMessage', message); // Broadcast to the chat room
    console.log(`Message sent to chat ${chatId}:`, content);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
