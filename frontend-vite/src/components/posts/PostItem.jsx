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
    <Box sx={{ 
      bgcolor: '#3F4E4F', 
      borderRadius: '8px', 
      p: 2, 
      mb: 3, 
      position: 'relative', 
      maxWidth: "70%", 
      margin: '0 auto',
      border: '2px solid rgba(162, 123, 92, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(162, 123, 92, 0.2)',
        borderColor: '#A27B5C'
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <UserLink 
            userId={post.createdBy?._id} 
            name={post.createdBy?.name}
            sx={{ color: '#DCD7C9', fontWeight: 600 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ 
            color: 'rgba(220, 215, 201, 0.8)', 
            fontSize: '0.8rem',
            fontStyle: 'italic'
          }}>
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
                sx={{ 
                  color: '#A27B5C',
                  '&:hover': {
                    bgcolor: 'rgba(162, 123, 92, 0.1)'
                  }
                }}
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
                PaperProps={{
                  sx: {
                    bgcolor: '#3F4E4F',
                    border: '1px solid rgba(162, 123, 92, 0.3)',
                    '& .MuiMenuItem-root': {
                      color: '#DCD7C9',
                      '&:hover': {
                        bgcolor: 'rgba(162, 123, 92, 0.2)'
                      }
                    }
                  }
                }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem 
                  onClick={handleDelete}
                  sx={{ color: '#ff6b6b' }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
      {isEditing ? (
        <EditPost post={post} onPostUpdated={onPostUpdated} onCancel={handleEditCancel} />
      ) : (
        <>
          <Typography sx={{ 
            color: '#DCD7C9', 
            mb: 2,
            lineHeight: 1.6
          }}>
            {post.content}
          </Typography>
          {post.media && post.media.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {post.media.map((media, idx) => {
                const isVideo = media.url.match(/\.(mp4|webm|ogg)$/i);
                return isVideo ? (
                  <video 
                    key={idx} 
                    src={media.url} 
                    controls 
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px',
                      border: '2px solid rgba(162, 123, 92, 0.3)'
                    }} 
                  />
                ) : (
                  <img 
                    key={idx} 
                    src={media.url} 
                    alt="post media" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      border: '2px solid rgba(162, 123, 92, 0.3)'
                    }} 
                  />
                );
              })}
            </Box>
          )}
        </>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography sx={{ 
          color: '#A27B5C', 
          fontSize: '0.8rem',
          fontWeight: 500
        }}>
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </Typography>
        <Typography sx={{ 
          color: '#A27B5C', 
          fontSize: '0.8rem',
          fontWeight: 500
        }}>
          {shareCount} {shareCount === 1 ? 'Share' : 'Shares'}
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        mb: 1,
        borderTop: '1px solid rgba(162, 123, 92, 0.2)',
        borderBottom: '1px solid rgba(162, 123, 92, 0.2)',
        py: 1
      }}>
        <IconButton 
          onClick={() => setShowCommentForm(!showCommentForm)} 
          sx={{ 
            color: '#A27B5C',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton 
          onClick={handleShare} 
          sx={{ 
            color: '#A27B5C',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <RepeatIcon />
        </IconButton>
        <IconButton 
          onClick={handleLike} 
          sx={{ 
            color: liked ? '#ff6b6b' : '#A27B5C',
            '&:hover': {
              bgcolor: liked ? 'rgba(255, 107, 107, 0.1)' : 'rgba(162, 123, 92, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton 
          sx={{ 
            color: '#A27B5C',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
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