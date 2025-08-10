const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Empty array for global chat
  lastMessage: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);