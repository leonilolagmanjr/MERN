import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  likePost,
  addComment,
  deletePost,
  sharePost,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import EditPost from "./EditPost";
import UserLink from "../UserLink";
import dayjs from "dayjs";

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
      const token = localStorage.getItem("token");
      const updatedPost = await likePost(post._id, token);
      setLiked(updatedPost.likes.includes(user?.id));
      setLikesCount(updatedPost.likes.length);
      onPostUpdated();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      await sharePost(post._id, token);
      onPostUpdated();
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const token = localStorage.getItem("token");
      const updatedPost = await addComment(post._id, { text }, token);
      setComments(updatedPost.comments);
      setShowCommentForm(false);
      onPostUpdated();
    } catch (err) {
      console.error("Error adding comment:", err);
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
      const token = localStorage.getItem("token");
      await deletePost(post._id, token);
      onPostUpdated();
    } catch (err) {
      console.error("Error deleting post:", err);
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

  // Get user initial for avatar
  const userInitial = post.createdBy?.name?.charAt(0)?.toUpperCase() ?? "U";
  const userName = post.createdBy?.name ?? "Unknown User";
  const userLevel = post.createdBy?.level ?? "Level 1";

  return (
    <div className="bg-[#1e1e26] rounded-xl border border-[rgba(200,136,74,0.2)] p-4 mb-4 transition-all duration-300 hover:border-[#c8884a] hover:shadow-lg">
      {/* Header with user info */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#c8884a] to-[#b07a40] flex items-center justify-center text-[#1a1008] text-sm font-bold shrink-0 ring-2 ring-[#c8884a]/25">
            {userInitial}
          </div>

          {/* User details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <UserLink
                compact
                userId={post.createdBy?._id}
                name={userName}
                className="text-sm"
              />
              <span className="text-[#c8884a] text-xs font-medium bg-[rgba(200,136,74,0.15)] px-2 py-0.5 rounded-full">
                {userLevel}
              </span>
            </div>
            <span className="text-[rgba(232,226,212,0.45)] text-xs">
              {dayjs(post.createdAt).format("h:mm A · MMM D, YYYY")}
            </span>
          </div>
        </div>

        {/* Menu button */}
        {user?.id === post.createdBy?._id && (
          <>
            <IconButton
              aria-label="post options"
              onClick={handleMenuClick}
              size="small"
              sx={{
                color: "#A27B5C",
                "&:hover": {
                  bgcolor: "rgba(200,136,74,0.1)",
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="post-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: "#1e1e26",
                  border: "1px solid rgba(200,136,74,0.2)",
                  "& .MuiMenuItem-root": {
                    color: "#e8e2d4",
                    fontSize: "0.875rem",
                    "&:hover": {
                      bgcolor: "rgba(200,136,74,0.1)",
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: "#ff6b6b" }}>
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Post content */}
      {isEditing ? (
        <EditPost
          post={post}
          onPostUpdated={onPostUpdated}
          onCancel={handleEditCancel}
        />
      ) : (
        <>
          <div className="ml-13 mb-3">
            <p className="text-[#e8e2d4] text-sm leading-relaxed mb-3">
              {post.content}
            </p>

            {/* Media attachments */}
            {post.media && post.media.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {post.media.map((media, idx) => {
                  const isVideo = media.url.match(/\.(mp4|webm|ogg)$/i);
                  return isVideo ? (
                    <video
                      key={idx}
                      src={media.url}
                      controls
                      className="w-full rounded-lg border border-[rgba(200,136,74,0.2)]"
                    />
                  ) : (
                    <img
                      key={idx}
                      src={media.url}
                      alt="post media"
                      className="w-full max-h-100 object-cover rounded-lg border border-[rgba(200,136,74,0.2)]"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-evenly pt-4 mt-4 border-t border-[rgba(200,136,74,0.15)]">
            <button
              onClick={handleLike}
              className="
              flex items-center gap-2
              min-w-22.5
              justify-center
              py-2.5
              rounded-xl
              "
            >
              {liked ? (
                <FavoriteIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              )}
              <span className="font-medium">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="
              flex items-center gap-2
              min-w-22.5
              justify-center
              py-2.5
              rounded-xl
              "
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
              <span className="font-medium">{comments.length}</span>
            </button>

            <button
              onClick={handleShare}
              className="
              flex items-center gap-2
              min-w-22.5
              justify-center
              py-2.5
              rounded-xl
              "
            >
              <RepeatIcon sx={{ fontSize: 18 }} />
              <span className="font-medium">{shareCount}</span>
            </button>

            <button
              className="
              flex items-center gap-2
              min-w-22.5
              justify-center
              py-2.5
              rounded-xl
              "
            >
              <BookmarkBorderIcon sx={{ fontSize: 18 }} />
              <span className="font-medium">Save</span>
            </button>
          </div>
        </>
      )}

      {/* Comment section */}
      {showCommentForm && (
        <div className="mt-3 pt-3 border-t border-[rgba(200,136,74,0.15)]">
          <CommentForm onSubmit={handleAddComment} />
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-3 space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostItem;
