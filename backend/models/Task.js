const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'canceled'], default: 'open' },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
