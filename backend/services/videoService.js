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

const getUserVideos = async (userId) => {
  return await Video.find({ uploader: userId }).sort({ createdAt: -1 });
};

const updateVideo = async (videoId, updateData) => {
  return await Video.findByIdAndUpdate(videoId, updateData, { new: true });
};

const deleteVideo = async (videoId) => {
  return await Video.findByIdAndDelete(videoId);
};

module.exports = {
  createVideo,
  getVideos,
  getUserVideos,
  updateVideo,
  deleteVideo,
};
