const express = require('express');
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController'); 

const router = express.Router();

// Route for getting the user profile
router.get('/profile', authenticate(), userController.getUserProfile);

// Route for updating the user profile
router.patch('/updateprofile', authenticate(), userController.updateUserProfile);

// Route for Deleting Profile
router.delete('/remove/:userId', authenticate('admin'), userController.deleteUserProfile);

// Route for Deleting Self
router.delete('/removeself', authenticate(), userController.deleteOwnProfile);

// Route to Change Role
router.put('/changerole', authenticate('admin'), userController.changeUserRole);

module.exports = router;
