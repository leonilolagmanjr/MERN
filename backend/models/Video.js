const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: { type: String, required: true }, // Path to the uploaded video file
  thumbnailUrl: { type: String }, // Optional thumbnail
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
