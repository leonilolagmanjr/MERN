const videoService = require('../services/videoService');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

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

    // Generate thumbnail asynchronously
    const videoPath = path.join(__dirname, '../uploads/videos', req.file.filename);
    generateThumbnail(video._id, videoPath);
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

const getUserVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const videos = await videoService.getUserVideos(userId);
    res.json(videos);
  } catch (err) {
    console.error('Get User Videos Error:', err);
    res.status(500).json({ msg: 'Server error fetching user videos' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const updateData = req.body;
    const updatedVideo = await videoService.updateVideo(videoId, updateData);
    if (!updatedVideo) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(updatedVideo);
  } catch (err) {
    console.error('Update Video Error:', err);
    res.status(500).json({ msg: 'Server error updating video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const deletedVideo = await videoService.deleteVideo(videoId);
    if (!deletedVideo) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json({ msg: 'Video deleted successfully' });
  } catch (err) {
    console.error('Delete Video Error:', err);
    res.status(500).json({ msg: 'Server error deleting video' });
  }
};

// New function to stream video with range support
const getVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await videoService.getVideoById(videoId);
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    console.error('Get Video Error:', err);
    res.status(500).json({ msg: 'Server error fetching video' });
  }
};

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

const generateThumbnail = (videoId, videoPath) => {
  const thumbnailFilename = path.parse(path.basename(videoPath)).name + '.jpg';
  const thumbnailPath = path.join(__dirname, '../uploads/thumbnails', thumbnailFilename);

  ffmpeg(videoPath)
    .screenshots({
      timestamps: [5], // At 5 seconds into the video
      filename: thumbnailFilename,
      folder: path.join(__dirname, '../uploads/thumbnails'),
      size: '320x180', // Standard thumbnail size
    })
    .on('end', async () => {
      try {
        const thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
        await videoService.updateVideo(videoId, { thumbnailUrl });
        console.log(`Thumbnail generated for video ${videoId}`);
      } catch (err) {
        console.error('Error updating video with thumbnail:', err);
      }
    })
    .on('error', (err) => {
      console.error('Error generating thumbnail:', err);
    });
};

module.exports = {
  uploadVideo,
  getVideos,
  getUserVideos,
  updateVideo,
  deleteVideo,
  getVideo,
  streamVideo,
};
