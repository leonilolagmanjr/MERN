const chatService = require('../services/chatService');

const createChat = async (req, res) => {
  const { otherUserId } = req.body;
  try {
    const chat = await chatService.getOrCreateChat(req.user.id, otherUserId);
    res.json(chat);
  } catch (err) {
    console.error('Error creating chat:', err.message); // Add detailed logging
    res.status(500).json({ msg: 'Failed to create or fetch chat. Please try again.' });
  }
};

const sendMessage = async (req, res) => {
  const { chatId, receiverId, content } = req.body;
  try {
    // Check if it's a global chat (no receiverId)
    const message = await chatService.sendMessage(chatId, req.user.id, receiverId || null, content);
    res.json(message);
  } catch (err) {
    console.error('Error sending message:', err.message); // Add detailed logging
    res.status(500).json({ msg: 'Failed to send message. Please try again.' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await chatService.getChatMessages(req.params.chatId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add this function to fetch all chats for the logged-in user
const getChats = async (req, res) => {
  try {
    const chats = await chatService.getUserChats(req.user.id);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getGlobalChat = async (req, res) => {
  try {
    const globalChat = await chatService.getOrCreateChat(req.user.id);
    res.json(globalChat);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch global chat.' });
  }
};

module.exports = { createChat, sendMessage, getMessages, getChats, getGlobalChat };