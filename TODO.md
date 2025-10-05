# Refactor User Links Task

## Steps
- [x] Create UserLink component in frontend/src/components/UserLink.js
- [x] Update PostItem.js to use UserLink for post.createdBy
- [x] Update CommentItem.js to use UserLink for comment.user
- [x] Update VideoPage.js to use UserLink for video.uploader
- [x] Update VideoGallery.js to use UserLink for video.uploader
- [x] Update DisplayVideo.js to use UserLink for video.uploader
- [x] Update Job.js to use UserLink for job.createdBy
- [x] Update Profile.js to use UserLink for profile.name, req.name, friend.name
- [x] Update FriendActions.js to use UserLink for req.name
- [x] Update Notification.js to use UserLink for req.name
- [x] Update Navbar.js to use UserLink for user?.name (already links, but text is "name's Profile")
- [x] Update ChatWidget.js to use UserLink for partner?.name in chat list, msg.sender?.name (already Link)
- [ ] Update EditProfile.js to use UserLink for user?.name (own name, not necessary)
- [ ] Update Auth.js to use UserLink for response.user.name (in messages, not UI)
- [x] Test the changes by running the app and verifying links work
