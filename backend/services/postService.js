const Post = require('../models/Post');

// Create Post
const createPost = async (content, media, createdBy, type = 'post', category, groupId, pinned = false) => {
  try {
    const post = new Post({
      content,
      media,
      createdBy,
      type,
      category,
      groupId,
      pinned,
    });
    await post.save();
    return post;
  } catch (err) {
    throw new Error(err.message || 'Error creating post');
  }
};

// Get All Posts with optional filters
const getAllPosts = async (filters = {}) => {
  try {
    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.groupId) query.groupId = filters.groupId;
    const posts = await Post.find(query).populate('createdBy', 'name').populate('comments.user', 'name').sort({ pinned: -1, createdAt: -1 });
    return posts;
  } catch (err) {
    throw new Error('Error fetching posts');
  }
};

// Get Posts by User
const getUserPosts = async (userId) => {
  try {
    return await Post.find({ createdBy: userId }).populate('createdBy', 'name').populate('comments.user', 'name').sort({ createdAt: -1 });
  } catch (err) {
    throw new Error('Error fetching user posts');
  }
};

// Update Post
const updatePost = async (postId, content, media, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (String(post.createdBy) !== String(userId)) throw new Error('Not authorized to update this post');
    post.content = content || post.content;
    post.media = media || post.media;
    await post.save();
    return post;
  } catch (err) {
    throw new Error(err.message || 'Error updating post');
  }
};

// Delete Post
const deletePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (String(post.createdBy) !== String(userId)) throw new Error('Not authorized to delete this post');
    await Post.findByIdAndDelete(postId);
    return post;
  } catch (err) {
    throw new Error('Error deleting post');
  }
};

// Like/Unlike Post
const likePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }
    await post.save();
    return post;
  } catch (err) {
    throw new Error('Error liking post');
  }
};

// Add Comment
const addComment = async (postId, userId, text) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    post.comments.push({ user: userId, text });
    await post.save();
    // Populate the user in the newly added comment
    await post.populate('comments.user', 'name');
    return post;
  } catch (err) {
    throw new Error('Error adding comment');
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
};
