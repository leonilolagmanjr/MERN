const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Service to register a user
const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      xp: newUser.xp,
    },
  };
};

// Service to login a user
const loginUser = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  // Check password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
