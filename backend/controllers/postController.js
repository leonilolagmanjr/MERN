const postService = require('../services/postService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/posts'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage }).array('media', 10); // max 10 files

// Create Post with media upload
const createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Error uploading files' });
    }
    try {
      const mediaUrls = req.files ? req.files.map(file => `/uploads/posts/${file.filename}`) : [];
      const { content } = req.body;
      const createdBy = req.user.id;
      const post = await postService.createPost(content, mediaUrls, createdBy);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ msg: 'Server error creating post' });
    }
  });
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching posts' });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await postService.getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching user posts' });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, media } = req.body;
    const userId = req.user.id;
    const updatedPost = await postService.updatePost(postId, content, media, userId);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error updating post' });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    await postService.deletePost(postId, userId);
    res.json({ msg: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error deleting post' });
  }
};

// Like/unlike post
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await postService.likePost(postId, userId);
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: 'Server error liking post' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { text } = req.body;
    const post = await postService.addComment(postId, userId, text);
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: 'Server error adding comment' });
  }
};

// Increment share count
const sharePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await postService.getPostById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.shareCount = (post.shareCount || 0) + 1;
    await post.save();
    res.json({ shareCount: post.shareCount });
  } catch (error) {
    res.status(500).json({ msg: 'Server error sharing post' });
  }
};

// Stream media for posts (videos)
const streamMedia = (req, res) => {
  const mediaPath = path.join(__dirname, '../uploads/posts', req.params.filename);
  fs.stat(mediaPath, (err, stats) => {
    if (err) {
      console.error('Media not found:', err);
      return res.status(404).send('Media not found');
    }

    const range = req.headers.range;
    if (!range) {
      // 416 Wrong range
      return res.status(416).send('Requires Range header');
    }

    const mediaSize = stats.size;
    const CHUNK_SIZE = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, mediaSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${mediaSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4', // Assuming videos are mp4, can be enhanced to detect type
    };

    res.writeHead(206, headers);

    const mediaStream = fs.createReadStream(mediaPath, { start, end });
    mediaStream.pipe(res);
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
  streamMedia,
  upload, // export multer upload middleware if needed
};
