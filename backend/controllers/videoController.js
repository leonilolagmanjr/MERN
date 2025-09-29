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

// New function to stream video with range support
const streamVideo = (req, res) => {
  const videoPath = path.join(__dirname, '../uploads/videos', req.params.filename);
  fs.stat(videoPath, (err, stats) => {
    if (err) {
      console.error('Video not found:', err);
      return res.status(404).send('Video not found');
    }

    const range = req.headers.range;
    if (!range) {
      // 416 Wrong range
      return res.status(416).send('Requires Range header');
    }

    const videoSize = stats.size;
    const CHUNK_SIZE = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  });
};

module.exports = {
  uploadVideo,
  getVideos,
  streamVideo,
};
