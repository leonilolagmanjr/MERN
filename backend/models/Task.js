const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' }
});

module.exports = mongoose.model('Task', taskSchema);
