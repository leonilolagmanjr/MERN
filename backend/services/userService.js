const User = require('../models/User'); 

// Function to Get User Profile
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error('Server error');
  }
};

// Function to Update User Profile
const updateUserProfile = async (userId, name, email) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (err) {
    throw new Error('Server error');
  }
};

// Function to Change User Role
const changeUserRole = async (userId, role) => {
  try {
    // Check if the role is valid
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (err) {
    throw new Error(`Error changing user role: ${err.message}`);
  }
};


// Function to Delete User
const deleteUserProfile = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    throw new Error ('Error Deleting User');
  }
};  

// Function to Add Connection
const addConnection = async (userId, email) => {
  const userToAdd = await User.findOne({ email });
  if (!userToAdd) throw new Error('User not found');
  const user = await User.findById(userId);
  user.connections.push(userToAdd._id);
  await user.save();
  return user.connections;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changeUserRole,
  addConnection
};
