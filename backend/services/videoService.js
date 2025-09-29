const Video = require('../models/Video');

const createVideo = async (videoData) => {
  const video = new Video(videoData);
  return await video.save();
};

const getVideos = async (searchQuery) => {
  const query = {};
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: 'i' };
  }
  return await Video.find(query).populate('uploader', 'name').sort({ createdAt: -1 });
};

module.exports = {
  createVideo,
  getVideos,
};
