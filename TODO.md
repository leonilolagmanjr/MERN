# TODO: Implement Social Media Page with Posts

## Backend Implementation
- [x] Create backend/models/Post.js with schema for content, media[], likes[], comments[]
- [x] Create backend/services/postService.js with CRUD, likePost, addComment functions
- [x] Create backend/controllers/postController.js with handlers for CRUD, upload, like, comment
- [x] Create backend/routes/postRoutes.js with multer setup for multiple file uploads
- [x] Update backend/server.js to include postRoutes

## Frontend Implementation
- [x] Create frontend/src/pages/SocialMedia.js for feed display and modals
- [x] Create frontend/src/components/posts/CreatePost.js for post creation form with text and file upload
- [x] Create frontend/src/components/posts/PostItem.js to display posts with likes and comments
- [x] Create frontend/src/components/posts/CommentForm.js and CommentItem.js for comments
- [x] Update frontend/src/services/api.js with post-related API calls
- [x] Update frontend/src/App.js to add /social route
- [x] Update frontend/src/components/Navbar.js to add "Social" menu item

## Testing
- [ ] Test multimedia uploads work correctly
- [ ] Test likes toggle functionality
- [ ] Test comments addition and display
- [ ] Ensure only post owner can update/delete posts
- [ ] Launch frontend and navigate to /social to test the page
