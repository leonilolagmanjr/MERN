const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  createdBy: {  // Changed from posterId to createdBy
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {  // Changed from doerId to assignedTo
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'completed', 'canceled'],  // Added 'canceled' status
    default: 'open' 
  }
});

module.exports = mongoose.model('Task', taskSchema);
