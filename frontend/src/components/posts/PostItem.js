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
import EditPost from './EditPost';
import UserLink from '../UserLink';
import dayjs from 'dayjs';

const PostItem = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
      await sharePost(post._id, token);
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

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ bgcolor: 'var(--color-card-bg)', borderRadius: 'var(--radius)', p: 2, mb: 3, position: 'relative', maxWidth:"70%", margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <UserLink userId={post.createdBy?._id} name={post.createdBy?.name} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: 'var(--color-text-gray)', fontSize: '0.8rem' }}>
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
                sx={{ color: 'var(--color-text)' }}
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
      {isEditing ? (
        <EditPost post={post} onPostUpdated={onPostUpdated} onCancel={handleEditCancel} />
      ) : (
        <>
          <Typography sx={{ color: 'var(--color-text)', mb: 2 }}>{post.content}</Typography>
          {post.media && post.media.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {post.media.map((media, idx) => {
                const isVideo = media.url.match(/\.(mp4|webm|ogg)$/i);
                return isVideo ? (
                  <video key={idx} src={media.url} controls style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                ) : (
                  <img key={idx} src={media.url} alt="post media" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius)' }} />
                );
              })}
            </Box>
          )}
        </>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography sx={{ color: 'var(--color-text-gray)', fontSize: '0.8rem' }}>
          {likesCount} Likes
        </Typography>
        <Typography sx={{ color: 'var(--color-text-gray)', fontSize: '0.8rem' }}>
          {shareCount} Shares
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
        <IconButton onClick={() => setShowCommentForm(!showCommentForm)} sx={{ color: 'var(--color-text)' }}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton onClick={handleShare} sx={{ color: 'var(--color-text)' }}>
          <RepeatIcon />
        </IconButton>
        <IconButton onClick={handleLike} sx={{ color: liked ? 'var(--color-error)' : 'var(--color-text)' }}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton sx={{ color: 'var(--color-text)' }}>
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
