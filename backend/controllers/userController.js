const userService = require('../services/userService');  // Import the user service

// Route to Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Route to Update User Profile
const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await userService.updateUserProfile(req.user, name, email);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Route to Delete User Profile
const deleteUserProfile = async (req, res) => {
  try {
    const user = await userService.deleteUserProfile(req.params.userId);
    res.json({msg: 'User Deleted'});
  } catch (err) {
    res.status(500).json({ msg: err.message});
  }
};

// Controller function to change user role
const changeUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const updatedUser = await userService.changeUserRole(userId, role);
    res.json({ msg: 'User role updated successfully', updatedUser });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


// Delete Own Profile
const deleteOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await userService.deleteUserProfile(userId);
    res.json({ msg: 'User profile deleted successfully', user: deletedUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteOwnProfile,
  changeUserRole
};
