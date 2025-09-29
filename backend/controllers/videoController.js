const videoService = require('../services/videoService');
const path = require('path');
const fs = require('fs');

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No video file uploaded' });
    }
    const { title, description } = req.body;
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const videoData = {
      title,
      description,
      uploader: req.user.id,
      videoUrl,
    };

    const video = await videoService.createVideo(videoData);
    res.status(201).json(video);
  } catch (err) {
    console.error('Upload Video Error:', err);
    res.status(500).json({ msg: 'Server error during video upload' });
  }
};

const getVideos = async (req, res) => {
  try {
    const search = req.query.search || '';
    const videos = await videoService.getVideos(search);
    res.json(videos);
  } catch (err) {
    console.error('Get Videos Error:', err);
    res.status(500).json({ msg: 'Server error fetching videos' });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
};
