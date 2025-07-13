const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Info',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
