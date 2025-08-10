const authService = require('../services/authService');

// Register Route
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login Route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
};
