const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  location: {
    type: { type: String, enum: ['remote', 'physical'], default: 'remote' },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'canceled'], default: 'open' },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
