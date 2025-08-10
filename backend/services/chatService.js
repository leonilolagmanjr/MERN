const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or Get Chat
const getOrCreateChat = async (userId, otherUserId = null) => {
  if (!otherUserId) {
    // Return the global chat room
    let globalChat = await Chat.findOne({ participants: [] });
    if (!globalChat) {
      globalChat = await Chat.create({ participants: [], lastMessage: 'Welcome to the global chat!' });
    }
    return globalChat;
  }

  // Validate friendship before creating or fetching chat
  const user = await User.findById(userId);
  if (!user.connections.includes(otherUserId)) {
    throw new Error('Cannot create chat: users are not friends');
  }

  // Handle private chats
  let chat = await Chat.findOne({ participants: { $all: [userId, otherUserId] } });
  if (!chat) {
    chat = await Chat.create({ participants: [userId, otherUserId] });
  }
  return chat;
};

// Send Message
const sendMessage = async (chatId, senderId, receiverId, content) => {
  // Allow messages in global chat (receiverId null)
  if (receiverId) {
    const sender = await User.findById(senderId);
    if (!sender.connections.includes(receiverId)) {
      throw new Error('Cannot send message: users are not friends');
    }
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId, // This will be null for global chat
    content,
    chat: chatId, // Ensure the chat ID is linked
  });
  await Chat.findByIdAndUpdate(chatId, { lastMessage: content, lastUpdated: Date.now() });
  return message;
};

// Fetch Chat Messages
const getChatMessages = async (chatId) => {
  return await Message.find({ chat: chatId })
    .sort({ timestamp: 1 })
    .populate('sender', 'name _id'); // Populate sender's name and ID
};

// Add this function to fetch all chats for a user
const getUserChats = async (userId) => {
  return await Chat.find({ participants: userId }).populate('participants', 'name email profileImage'); // Add more fields
};

module.exports = { getOrCreateChat, sendMessage, getChatMessages, getUserChats };
