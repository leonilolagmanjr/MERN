import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { likePost, addComment, deletePost, sharePost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import dayjs from 'dayjs';

const PostItem = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = await likePost(post._id, token);
      setLiked(updatedPost.likes.includes(user?.id));
      setLikesCount(updatedPost.likes.length);
      onPostUpdated();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await sharePost(post._id, token);
      setShareCount(response.shareCount);
      onPostUpdated();
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = await addComment(post._id, { text }, token);
      setComments(updatedPost.comments);
      setShowCommentForm(false);
      onPostUpdated();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deletePost(post._id, token);
      onPostUpdated();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      handleMenuClose();
    }
  };

  // Placeholder for edit functionality
  const handleEdit = () => {
    alert('Edit functionality to be implemented');
    handleMenuClose();
  };

  return (
    <Box sx={{ bgcolor: '#23262e', borderRadius: 2, p: 2, mb: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography sx={{ color: '#66c0f4', fontWeight: 'bold' }}>
            {post.createdBy?.name || 'Unknown'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
            {dayjs(post.createdAt).format('h:mm A · MMM D, YYYY')}
          </Typography>
          {user?.id === post.createdBy?._id && (
            <>
              <IconButton
                aria-label="post options"
                aria-controls={open ? 'post-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
                size="small"
                sx={{ color: '#c7d5e0' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
      <Typography sx={{ color: '#c7d5e0', mb: 2 }}>{post.content}</Typography>
      {post.media && post.media.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {post.media.map((url, idx) => {
            const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
            return isVideo ? (
              <video key={idx} src={`http://${window.location.hostname}:5000/api/posts/stream/${url.split('/').pop()}`} controls width="200" />
            ) : (
              <img key={idx} src={`http://${window.location.hostname}:5000${url}`} alt="post media" style={{ maxWidth: 200, borderRadius: 4 }} />
            );
          })}
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
          {likesCount} Likes
        </Typography>
        <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
          {shareCount} Shares
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
        <IconButton onClick={() => setShowCommentForm(!showCommentForm)} sx={{ color: '#c7d5e0' }}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton onClick={handleShare} sx={{ color: '#c7d5e0' }}>
          <RepeatIcon />
        </IconButton>
        <IconButton onClick={handleLike} sx={{ color: liked ? '#ff4c4c' : '#c7d5e0' }}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton sx={{ color: '#c7d5e0' }}>
          <BookmarkBorderIcon />
        </IconButton>
      </Box>
      {showCommentForm && <CommentForm onSubmit={handleAddComment} />}
      <Box sx={{ mt: 2 }}>
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default PostItem;
